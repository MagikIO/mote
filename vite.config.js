// vite.config.js
import { resolve, join } from 'path'
import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: [
        join(resolve(__dirname, 'src'), 'M.ts'),
      ],
      name: 'Mote',
      fileName: 'mote',
    },
  },
  plugins: [dtsPlugin({})],
})
