/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
//import ssr from 'vite-plugin-ssr/plugin'
import eslint from 'vite-plugin-eslint'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    checker({ typescript: true })
  ],
  build: {
    emptyOutDir: true,
    outDir: '../server/dist'
  },
  server: {
    open: true,
    proxy: { '/api': { target: 'http://localhost:4008', changeOrigin: true } }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/setupTests.ts']
    }
  }
}))
