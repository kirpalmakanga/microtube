// jshint esversion: 6, asi: true
// eslint-env es6

const path = require('path')
const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

const packageJSON = require('./package.json')

const config = {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    hot: true,
    outputPath: path.join(__dirname, 'public'),
    noInfo: true,
    publicPath: './public',
    contentBase: './'
  },
  entry: [
    './app/main.js'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: './',
    filename: 'app.js'
  },
  plugins: [
    new LodashModuleReplacementPlugin({
      'collections': true,
      'paths': true
    }),
    // new BundleAnalyzerPlugin(),
    new webpack.IgnorePlugin(/^\.\/lang$/, /moment$/),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
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
    }),
    new SWPrecacheWebpackPlugin({
      cacheId: 'youtube-lite',
      filename: '../sw.js',
      maximumFileSizeToCacheInBytes: 4194304,
      minify: true,
      staticFileGlobs: [
        'public/*',
      ],
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['lodash'],
          presets: ['es2015']
        }
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

module.exports = config
