import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Dynamically get full Gitpod hostname from the workspace URL
let allowedHosts = []
const rawUrl = process.env.GITPOD_WORKSPACE_URL

if (rawUrl) {
  const url = new URL(rawUrl)
  // Gitpod uses this pattern: 5173-yourname-yourproject.ws-region.gitpod.io
  const port = 5173
  const fullHost = `${port}-${url.hostname}`
  allowedHosts = [fullHost]
}

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    strictPort: true,
    allowedHosts,
  },
})


