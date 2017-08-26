import { IndexRoute, Route } from 'react-router'

import { getAllPlaylists, getPlaylistItems, getSubscriptions } from './actions/database'
import { refreshAccessToken } from './actions/auth'

import App from './components/App.jsx'
import Playlists from './components/containers/Playlists.jsx'
import Playlist from './components/containers/Playlist.jsx'
import Subscriptions from './components/containers/Subscriptions.jsx'
import Channel from './components/containers/Channel.jsx'

export default function getRoutes ({ getState, dispatch }) {
   function refreshToken () {
     const requestToken = () => {
       const { auth } = getState()

       if(!auth.refresh) {
         return
       }

       refreshAccessToken(auth.refresh, token => {
         if (token) {
             dispatch({ type: 'OAUTH_REFRESH', data: { token } })
         }
       })
     }

     const refreshWatcher = setInterval(requestToken, 3540000)

     requestToken()
   }

  return (
    <Route path='/' onEnter={refreshToken} component={App}>
      <IndexRoute component={Playlists} />
       <Route
        path='/playlist/:id'
        component={Playlist}
        onLeave={() => dispatch({ type: 'CLEAR_PLAYLIST_ITEMS' })}
      />
       <Route path='/subscriptions' component={Subscriptions} />
       <Route
        path='/channel/:id'
        component={Channel}
        onLeave={() => dispatch({ type: 'CLEAR_CHANNEL_VIDEOS' })}
      />
    </Route>
  )
}
