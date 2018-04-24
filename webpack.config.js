require("babel-polyfill");
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: ['babel-polyfill', './client'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: { presets: ['es2015', 'stage-0', 'react'] }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: 'client/index.html'})
  ]
}
