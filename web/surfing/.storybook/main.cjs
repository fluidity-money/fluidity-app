const svgr = require("vite-plugin-svgr");
const tsconfigPaths = require("vite-tsconfig-paths").default;
const { mergeConfig } = require("vite");
const { resolve } = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-pseudo-states",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config, { configType }) {
    // return the customized config
    console.log(tsconfigPaths);
    const conf = mergeConfig(config, {
      // Custom resolve paths, copied from root vite.config
      plugins: [svgr(), tsconfigPaths()],
      css: {
        preprocessorOptions: {
          scss: {
            includePaths: [resolve(__dirname, "../src")],
          },
        },
      },
    });

    return conf;
  },
};
