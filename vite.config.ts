import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  optimizeDeps: {
    include: ['node_modules/worker_threads'],
  },
  ssr: {
    noExternal: ['worker_threads'],
  },
})
