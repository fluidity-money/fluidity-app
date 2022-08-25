const svgr = require('vite-plugin-svgr');
const { mergeConfig } = require('vite');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-pseudo-states",
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-vite"
  },
  "features": {
    "storyStoreV7": true
  },
  async viteFinal(config, { configType }) {
    // return the customized config
    return mergeConfig(config, {
      // Custom resolve paths, copied from root vite.config
      resolve: {
        alias: [
          { find: '@assets', replacement: resolve(__dirname, 'src/assets') },
          { find: '@', replacement: resolve(__dirname, 'src') }],
      },
      plugins: [svgr()],
    });
  },
};
