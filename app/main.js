import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import Router from 'preact-router'
import AsyncRoute from 'preact-async-route'

import configureStore from './store/configureStore'

import App from './components/App'
import Playlists from './components/containers/Playlists'

const makeGetComponent = (path) => async () => {
    const module = await System.import(path + '.jsx')
    return module.default
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
          <AsyncRoute path='/subscriptions' getComponent={makeGetComponent('./components/containers/Channels')}/>
          <AsyncRoute path='/channel/:id' getComponent={makeGetComponent('./components/containers/Channel')}/>
          <AsyncRoute path='/search' getComponent={makeGetComponent('./components/containers/Search')}/>
          <AsyncRoute path='/login' getComponent={makeGetComponent('./components/containers/Login')}/>
        </Router>
      </App>
    </Provider>,
    document.querySelector('.app')
  )
  document.querySelector('.app-loader').classList.remove('app-loader--active')
})()
