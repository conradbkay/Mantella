/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
import checker from 'vite-plugin-checker'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true, target: 'react' }),
    react(),
    tsconfigPaths(),
    svgrPlugin(),
    checker({ typescript: true })
  ],
  build: {
    emptyOutDir: true,
    outDir: '../server/dist'
  },
  server: {
    open: true,

    proxy: {
      '/api': { target: 'http://localhost:4008', changeOrigin: true }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/']
    }
  }
}))
