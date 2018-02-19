const path = require('path')
const OfflinePlugin = require('offline-plugin')

module.exports = (options, req) => ({
  quiet: false,
  port: 8080,
  entry: {
    client: './src/index.js'
  },
  title: 'Microtube',
  devServer: {
    quiet: false
  },
  webpack(config) {
    const webpack = req('webpack')

    config.resolve.alias = {
      styles: path.resolve(__dirname, 'src/assets/styles/'),
      actions: path.resolve(__dirname, 'src/actions/'),
      containers: path.resolve(__dirname, 'src/containers/'),
      components: path.resolve(__dirname, 'src/components/'),
      lib: path.resolve(__dirname, 'src/lib/'),
      store: path.resolve(__dirname, 'src/store/')
    }

    config.resolve.extensions.push('tsx')

    config.plugins.push(
      new webpack.ProvidePlugin({
        h: 'preact/h',
        Component: 'preact/component',
        Preact: 'preact',
        PreactRouter: 'preact-router',
        PreactRedux: 'preact-redux'
      })
      // new OfflinePlugin()
    )

    return config
  },
  presets: [require('poi-preset-offline')(), require('poi-preset-typescript')()]
})
