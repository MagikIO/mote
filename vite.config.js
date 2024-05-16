// vite.config.js
import { resolve, join } from 'path'
import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'

const src = resolve(__dirname, 'src')

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: [
        join(src, 'All.ts'),
        join(src, 'Mote.ts'),
        join(src, 'El.ts'),
      ],
      name: 'Mote',
    },
  },
  plugins: [dtsPlugin({ bundledPackages: true })],
})
