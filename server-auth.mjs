import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

const SESSION_COOKIE = 'webdev_app_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7
const loginAttempts = new Map()

function base64UrlEncode(value) { return Buffer.from(value).toString('base64url') }
function base64UrlDecode(value) { return Buffer.from(value, 'base64url').toString('utf8') }

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
    if (payload.authProvider !== 'mera' || !payload.username) return null
    return payload
  } catch { return null }
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

function cookieHeader(name, value, maxAge, request) {
  const secure = isSecureRequest(request)
  const attributes = [`${name}=${encodeURIComponent(value)}`, 'Path=/', `Max-Age=${maxAge}`, `SameSite=${secure ? 'None' : 'Lax'}`, 'HttpOnly']
  if (secure) attributes.push('Secure')
  return attributes.join('; ')
}

function sendJson(response, status, payload, extraHeaders = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders })
  response.end(JSON.stringify(payload))
}

function constantTimeEqual(left, right) {
  const leftHash = createHash('sha256').update(String(left ?? '')).digest()
  const rightHash = createHash('sha256').update(String(right ?? '')).digest()
  return timingSafeEqual(leftHash, rightHash)
}

function clientKey(request) {
  return String(request.headers['x-forwarded-for'] || request.socket.remoteAddress || 'unknown').split(',')[0].trim()
}

function isRateLimited(request) {
  const now = Date.now()
  const key = clientKey(request)
  const recent = (loginAttempts.get(key) || []).filter((timestamp) => now - timestamp < 15 * 60 * 1000)
  if (recent.length >= 8) { loginAttempts.set(key, recent); return true }
  recent.push(now)
  loginAttempts.set(key, recent)
  return false
}

function clearLoginAttempts(request) { loginAttempts.delete(clientKey(request)) }

async function readJsonBody(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > 16 * 1024) throw new Error('Request body is too large')
  }
  try { return JSON.parse(body || '{}') } catch { return null }
}

async function handleAuthRequest(request, response, url) {
  if (url.pathname === '/api/auth/login') {
    if (request.method !== 'POST') return sendJson(response, 405, { error: 'Use POST to sign in' }, { Allow: 'POST' })
    if (!process.env.MERA_LOGIN_USERNAME || !process.env.MERA_LOGIN_PASSWORD || !process.env.MANUS_JWT_SECRET || !process.env.MANUS_PROJECT_ID) return sendJson(response, 503, { error: 'MERA login is not configured' })
    if (isRateLimited(request)) return sendJson(response, 429, { error: 'Too many login attempts. Try again later.' })
    const credentials = await readJsonBody(request)
    const username = typeof credentials?.username === 'string' ? credentials.username.trim() : ''
    const password = typeof credentials?.password === 'string' ? credentials.password : ''
    if (!username || !password || !constantTimeEqual(username, process.env.MERA_LOGIN_USERNAME) || !constantTimeEqual(password, process.env.MERA_LOGIN_PASSWORD)) return sendJson(response, 401, { error: 'Incorrect MERA username or password' })
    clearLoginAttempts(request)
    const now = Math.floor(Date.now() / 1000)
    const session = signJwt({ appId: process.env.MANUS_PROJECT_ID, authProvider: 'mera', openId: `mera:${process.env.MERA_LOGIN_USERNAME}`, username: process.env.MERA_LOGIN_USERNAME, name: process.env.MERA_LOGIN_USERNAME, email: process.env.MERA_LOGIN_USERNAME.includes('@') ? process.env.MERA_LOGIN_USERNAME : '', role: 'management', iat: now, exp: now + SESSION_MAX_AGE }, process.env.MANUS_JWT_SECRET)
    return sendJson(response, 200, { authenticated: true }, { 'Set-Cookie': cookieHeader(SESSION_COOKIE, session, SESSION_MAX_AGE, request) })
  }

  if (url.pathname === '/api/auth/me' && request.method === 'GET') {
    const session = verifyJwt(parseCookies(request)[SESSION_COOKIE], process.env.MANUS_JWT_SECRET)
    if (!session) return sendJson(response, 401, { authenticated: false })
    return sendJson(response, 200, { authenticated: true, user: { openId: session.openId, name: session.name, email: session.email, username: session.username, role: session.role } })
  }

  if (url.pathname === '/api/auth/logout' && (request.method === 'GET' || request.method === 'POST')) {
    return sendJson(response, 200, { authenticated: false }, { 'Set-Cookie': cookieHeader(SESSION_COOKIE, '', 0, request) })
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
