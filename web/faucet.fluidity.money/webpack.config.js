
const path = require('path');
const webpack = require('webpack');

const envFluApiUri = process.env.REACT_APP_FLU_API_URI;

const err = message => {
  console.error(message);
  process.exit(1);
};

if (envFluApiUri === undefined)
  err("REACT_APP_FLU_API_URI not set!");

module.exports = {
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  mode: 'development',

  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin({
      REACT_APP_FLU_API_URI: envFluApiUri
    })
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
};
