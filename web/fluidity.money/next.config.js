module.exports = {
compiler: {
    relay: {
    src: './',
    language: 'typescript',
    }
},
webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true 
    return config;
  }
}