const path = require('path')
const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const OfflinePlugin = require('offline-plugin')

let isDevelopmentMode = !(require('yargs').argv.p || false)

const config = {
  devServer: {
    hot: true,
    open: true,
    outputPath: path.join(__dirname, 'public'),
    noInfo: true,
    publicPath: './public',
    contentBase: './'
  },
  entry: {
    app: './app/main.js'
  },
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: './',
    filename: '[name].js'
  },
  plugins: [
    new LodashModuleReplacementPlugin({
      'collections': true,
      'paths': true
    }),
    new webpack.IgnorePlugin(/^\.\/lang$/, /moment$/),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: ({ context }) => context && context.indexOf('node_modules') >= 0
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new WriteFilePlugin({
      test: /\.js$/,
      useHashIndex: false
    }),
    new ExtractTextPlugin({
        filename: 'app.css',
        allChunks: true
    }),
    new OfflinePlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      assets: path.resolve(__dirname, 'assets/'),
      actions: path.resolve(__dirname, 'app/actions/'),
      api: path.resolve(__dirname, 'app/api/'),
      containers: path.resolve(__dirname, 'app/containers/'),
      components: path.resolve(__dirname, 'app/components/'),
      libs: path.resolve(__dirname, 'app/lib/')
    }
  }
}

if (isDevelopmentMode) {
  config.devtool = 'cheap-module-eval-source-map'
}

module.exports = config
