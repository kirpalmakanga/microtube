import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import Router from 'preact-router'

import configureStore from './store/configureStore'

import App from './components/App'
import Playlists from './components/containers/Playlists'
import Playlist from './components/containers/Playlist'
import Subscriptions from './components/containers/Subscriptions'
import Channel from './components/containers/Channel'

(() => {
  const store = configureStore(window.INITIAL_STATE)

  OfflinePluginRuntime.install()

  render(
    <Provider store={store}>
      <App>
        <Router>
          <Playlists path='/' />
          <Playlist path='/playlist/:id' />
          <Subscriptions path='/subscriptions' />
          <Channel path='/channel/:id' />
        </Router>
      </App>
    </Provider>,
    document.querySelector('.app')
  )
  document.querySelector('.app-loader').classList.remove('app-loader--active')
})()
