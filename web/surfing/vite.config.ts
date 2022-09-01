// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'
import relay from 'vite-plugin-relay';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), tsconfigPaths(), dts(), relay],
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
      external: ["react", "react-dom"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        }
      }
    }
  }
})
