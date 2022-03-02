
const path = require('path');
const webpack = require('webpack');

module.exports = env => {
  return {
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    mode: 'development',

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
      extensions: ['.tsx', '.ts', '.js'],
    },

    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser'
      }),
      new webpack.DefinePlugin({
        "process.env.REACT_APP_FULLPAGE_JS_KEY": JSON.stringify(env.REACT_APP_FULLPAGE_JS_KEY)
      }),
    ],

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    },
  }
};
