// vite.config.js
import { resolve, join } from 'path'
import { defineConfig } from 'vite'

const root = resolve(__dirname, 'src')

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: [
        join(root, 'M.ts'),
      ],
      name: 'Mote',
      fileName: 'mote',
    },
  },
})
