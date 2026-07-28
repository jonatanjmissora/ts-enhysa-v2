import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'
import { visualizer } from 'rollup-plugin-visualizer'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  optimizeDeps: {
    include: ['@react-pdf/renderer'],
  },
  plugins: [
    devtools(),
    netlify({ edgeSSR: false }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    visualizer({ filename: 'stats.html' }),
  ],
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/recharts')) return 'vendor-recharts'
          if (id.includes('node_modules/@react-pdf')) return 'vendor-pdf-gen'
          if (id.includes('node_modules/react-pdf')) return 'vendor-pdf-view'
          if (id.includes('node_modules/better-auth')) return 'vendor-auth'
        },
      },
    },
  },
})

export default config
