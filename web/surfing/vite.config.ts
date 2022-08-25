import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: [
      { find: '~/assets', replacement: resolve(__dirname, 'src/assets') },
      { find: '~/', replacement: resolve(__dirname, 'src') }],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib.tsx'),
      name: 'Surfing',
      // the proper extensions will be added
      fileName: 'surfing'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
