import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import Router from 'preact-router'
import AsyncRoute from 'preact-async-route'

import configureStore from './store/configureStore'

import App from './components/App'
import Playlists from './components/containers/Playlists'

const makeGetComponent = (path) => (url, cb, props) => {
  return System.import(path + '.jsx').then(module => module.default)
}

(() => {
  const store = configureStore(window.INITIAL_STATE)

  OfflinePluginRuntime.install()

  render(
    <Provider store={store}>
      <App>
        <Router>
          <Playlists path='/' />
          <AsyncRoute path='/playlist/:id' getComponent={makeGetComponent('./components/containers/Playlist')}/>
          <AsyncRoute path='/subscriptions' getComponent={makeGetComponent('./components/containers/Subscriptions')}/>
          <AsyncRoute path='/channel/:id' getComponent={makeGetComponent('./components/containers/Channel')}/>
          <AsyncRoute path='/search' getComponent={makeGetComponent('./components/containers/Search')}/>
        </Router>
      </App>
    </Provider>,
    document.querySelector('.app')
  )
  document.querySelector('.app-loader').classList.remove('app-loader--active')
})()
