const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: [
    'webpack-hot-middleware/client'
  ],

  // Configuration for dev server
  devServer: {
    contentBase: path.resolve(path.join(__dirname, 'public')),
    port: 3355
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
