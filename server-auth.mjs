import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

const SESSION_COOKIE = 'webdev_app_session'
const STATE_COOKIE = 'mera_oauth_state'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url')
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function signJwt(payload, secret) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64UrlEncode(JSON.stringify(payload))
  const signature = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${signature}`
}

function verifyJwt(token, secret) {
  if (!token || !secret) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, body, signature] = parts
  try {
    const parsedHeader = JSON.parse(base64UrlDecode(header))
    const payload = JSON.parse(base64UrlDecode(body))
    if (parsedHeader.alg !== 'HS256') return null
    const expected = createHmac('sha256', secret).update(`${header}.${body}`).digest()
    const actual = Buffer.from(signature, 'base64url')
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
    if (typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) return null
    if (process.env.MANUS_PROJECT_ID && payload.appId !== process.env.MANUS_PROJECT_ID) return null
    if (!payload.openId) return null
    return payload
  } catch {
    return null
  }
}

function parseCookies(request) {
  const header = request.headers.cookie || ''
  return Object.fromEntries(header.split(';').filter(Boolean).map((part) => {
    const [name, ...value] = part.trim().split('=')
    return [name, decodeURIComponent(value.join('='))]
  }))
}

function isSecureRequest(request) {
  const forwardedProto = String(request.headers['x-forwarded-proto'] || '').split(',')[0].trim()
  return forwardedProto === 'https' || request.headers.host?.includes('manus.computer') === true
}

function cookieHeader(name, value, maxAge, request, httpOnly = true) {
  const secure = isSecureRequest(request)
  const attributes = [`${name}=${encodeURIComponent(value)}`, 'Path=/', `Max-Age=${maxAge}`, `SameSite=${secure ? 'None' : 'Lax'}`]
  if (httpOnly) attributes.push('HttpOnly')
  if (secure) attributes.push('Secure')
  return attributes.join('; ')
}

function sendJson(response, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload)
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders })
  response.end(body)
}

function redirect(response, location, extraHeaders = {}) {
  response.writeHead(302, { Location: location, 'Cache-Control': 'no-store', ...extraHeaders })
  response.end()
}

function appOrigin(request) {
  const proto = String(request.headers['x-forwarded-proto'] || 'http').split(',')[0].trim()
  const host = String(request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000').split(',')[0].trim()
  return `${proto}://${host}`
}

function callbackUrl(request) {
  return `${appOrigin(request)}/api/auth/callback`
}

async function readJson(response) {
  const text = await response.text()
  try { return JSON.parse(text) } catch { return { error: text } }
}

async function exchangeCode(code, redirectUri) {
  const { MANUS_PROJECT_ID: clientId, MANUS_OAUTH_API_URL: apiUrl } = process.env
  if (!clientId || !apiUrl || !process.env.MANUS_JWT_SECRET) throw new Error('Manus OAuth is not configured for this project')
  const tokenResponse = await fetch(`${apiUrl.replace(/\/$/, '')}/webdev.v1.WebDevAuthPublicService/ExchangeToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, grantType: 'authorization_code', code, redirectUri }),
  })
  const tokenData = await readJson(tokenResponse)
  if (!tokenResponse.ok || !tokenData.accessToken) throw new Error(tokenData.message || tokenData.error || 'OAuth token exchange failed')
  const userResponse = await fetch(`${apiUrl.replace(/\/$/, '')}/webdev.v1.WebDevAuthPublicService/GetUserInfo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenData.accessToken}` },
    body: JSON.stringify({ accessToken: tokenData.accessToken }),
  })
  const userData = await readJson(userResponse)
  if (!userResponse.ok || !userData.openId) throw new Error(userData.message || userData.error || 'Unable to resolve Manus identity')
  return userData
}

async function handleAuthRequest(request, response, url) {
  const path = url.pathname
  if (path === '/api/auth/login' && request.method === 'GET') {
    const portalUrl = process.env.MANUS_OAUTH_PORTAL_URL
    if (!portalUrl || !process.env.MANUS_PROJECT_ID) return sendJson(response, 503, { error: 'Manus OAuth is not configured' })
    const nonce = randomBytes(24).toString('hex')
    const redirectUri = callbackUrl(request)
    const state = base64UrlEncode(JSON.stringify({ redirectUri, nonce }))
    const portal = new URL(`${portalUrl.replace(/\/$/, '')}/app-auth`)
    portal.searchParams.set('appId', process.env.MANUS_PROJECT_ID)
    portal.searchParams.set('redirectUri', redirectUri)
    portal.searchParams.set('state', state)
    portal.searchParams.set('responseType', 'code')
    return redirect(response, portal.toString(), { 'Set-Cookie': cookieHeader(STATE_COOKIE, nonce, 600, request) })
  }

  if (path === '/api/auth/callback' && request.method === 'GET') {
    const cookies = parseCookies(request)
    const rawState = url.searchParams.get('state') || ''
    const code = url.searchParams.get('code') || ''
    const error = url.searchParams.get('error')
    if (error) return redirect(response, `/?authError=${encodeURIComponent(error)}`, { 'Set-Cookie': cookieHeader(STATE_COOKIE, '', 0, request) })
    let state
    try { state = JSON.parse(base64UrlDecode(rawState)) } catch { state = null }
    if (!state?.nonce || !state?.redirectUri || state.nonce !== cookies[STATE_COOKIE] || state.redirectUri !== callbackUrl(request) || !code) {
      return sendJson(response, 400, { error: 'Invalid or expired OAuth state' }, { 'Set-Cookie': cookieHeader(STATE_COOKIE, '', 0, request) })
    }
    try {
      const user = await exchangeCode(code, state.redirectUri)
      const now = Math.floor(Date.now() / 1000)
      const session = signJwt({ appId: process.env.MANUS_PROJECT_ID, openId: user.openId, name: user.name || user.email || 'MERA operator', email: user.email || '', platforms: user.platforms || [], role: 'management', iat: now, exp: now + SESSION_MAX_AGE }, process.env.MANUS_JWT_SECRET)
      return redirect(response, '/', { 'Set-Cookie': [cookieHeader(SESSION_COOKIE, session, SESSION_MAX_AGE, request), cookieHeader(STATE_COOKIE, '', 0, request)] })
    } catch (authError) {
      return redirect(response, `/?authError=${encodeURIComponent(authError instanceof Error ? authError.message : 'Login failed')}`, { 'Set-Cookie': cookieHeader(STATE_COOKIE, '', 0, request) })
    }
  }

  if (path === '/api/auth/me' && request.method === 'GET') {
    const session = verifyJwt(parseCookies(request)[SESSION_COOKIE], process.env.MANUS_JWT_SECRET)
    if (!session) return sendJson(response, 401, { authenticated: false })
    return sendJson(response, 200, { authenticated: true, user: { openId: session.openId, name: session.name, email: session.email, role: session.role, platforms: session.platforms } })
  }

  if (path === '/api/auth/logout' && (request.method === 'GET' || request.method === 'POST')) {
    return redirect(response, '/', { 'Set-Cookie': cookieHeader(SESSION_COOKIE, '', 0, request) })
  }

  return false
}

export function createAuthMiddleware() {
  return (request, response, next) => {
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost:3000'}`)
    if (!url.pathname.startsWith('/api/auth/')) return next()
    Promise.resolve(handleAuthRequest(request, response, url)).catch((error) => sendJson(response, 500, { error: error instanceof Error ? error.message : 'Authentication error' }))
  }
}

export { handleAuthRequest, verifyJwt }
