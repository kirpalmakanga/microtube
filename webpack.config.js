// jshint esversion: 6, asi: true
// eslint-env es6

const path = require('path')
const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    outputPath: path.join(__dirname, 'public'),
    noInfo: true,
    publicPath: './public/'
  },
  entry: [
    './app/main'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js',
    publicPath: './public/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new WriteFilePlugin({
      test: /\.js$/,
      useHashIndex: false
    }),
    new ExtractTextPlugin('app.css', {
        allChunks: true
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader']
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  }
}

if (process.env.ENVIRONMENT === 'PRODUCTION') {
  config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  )
}

module.exports = config
