module.exports = {
  env: {
    twitterBearerToken: process.env.TWITTER_BEARER_TOKEN,
    fluidityID: process.env.FLUIDITY_ID,
  },
  compiler: {
    relay: {
      src: "./",
      language: "typescript",
    },
  },
};
