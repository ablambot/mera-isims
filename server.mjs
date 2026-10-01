import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { createAuthMiddleware } from './server-auth.mjs'

const root = fileURLToPath(new URL('.', import.meta.url))
const dist = resolve(root, 'dist')
const port = Number(process.env.PORT || 3000)
const auth = createAuthMiddleware()

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
}

function serveFile(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' })
    return response.end()
  }
  const requestPath = decodeURIComponent((request.url || '/').split('?')[0])
  if (requestPath === '/_app/health') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
    return response.end(JSON.stringify({ ok: true, service: 'mera-isims' }))
  }
  const requested = requestPath === '/' ? '/index.html' : requestPath
  const candidate = resolve(dist, `.${normalize(requested)}`)
  const safe = candidate.startsWith(`${dist}/`) || candidate === dist
  const filePath = safe && existsSync(candidate) && statSync(candidate).isFile() ? candidate : join(dist, 'index.html')
  if (!existsSync(filePath)) {
    response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
    return response.end('MERA ISIMS is building')
  }
  response.writeHead(200, { 'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream', 'Cache-Control': filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable' })
  if (request.method === 'HEAD') return response.end()
  return createReadStream(filePath).pipe(response)
}

const server = createServer((request, response) => {
  auth(request, response, () => serveFile(request, response))
})

server.listen(port, '0.0.0.0', () => {
  console.log(`MERA ISIMS server listening on ${port}`)
})
