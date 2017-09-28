import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import Router from 'preact-router'

import configureStore from './store/configureStore'

import App from './components/App.jsx'
import Playlists from './components/containers/Playlists.jsx'
import Playlist from './components/containers/Playlist.jsx'
import Subscriptions from './components/containers/Subscriptions.jsx'
import Channel from './components/containers/Channel.jsx'

const store = configureStore(window.INITIAL_STATE)

OfflinePluginRuntime.install()

/*
  <Route  component={Playlist} onLeave={() => dispatch({type: 'CLEAR_PLAYLIST_ITEMS'})}/>
  <Route component={Channel} onLeave={() => dispatch({type: 'CLEAR_CHANNEL_VIDEOS'})}/>
*/

(() => {
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
