// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { resolve } from "path";
import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import injectCSS from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  // I trust the authors of these plugins are compliant with vite's plugin API
  plugins: [
    svgr(),
    dts(),
    react(),
    tsconfigPaths(),
    injectCSS(),
  ] as PluginOption[],
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [resolve(__dirname, "./src")],
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib.tsx"),
      name: "Surfing",
      // the proper extensions will be added
      fileName: "surfing",
      formats: ["es", "cjs"],
    },
    emptyOutDir: false,
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
        },
      },
    },
  },
});
