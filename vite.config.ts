import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore — shared runtime middleware is a plain Node module used by Vite preview.
import { createAuthMiddleware } from './server-auth.mjs'

const authPlugin = () => ({
  name: 'mera-auth',
  configureServer(server: { middlewares: { use: (middleware: unknown) => void } }) {
    server.middlewares.use(createAuthMiddleware())
  },
})

export default defineConfig({
  plugins: [react(), authPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
})
