const svgr = require('vite-plugin-svgr');
const { loadConfigFromFile, mergeConfig } = require('vite');
const { resolve } = require('path');

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
    const { config: userConfig } = await loadConfigFromFile(
      resolve(__dirname, "../vite.config.ts")
    );
    // return the customized config
    return mergeConfig(config, {
      ...userConfig,
      // customize the Vite config here
      plugins: [
        svgr(),
      ],
    });
  },
};
