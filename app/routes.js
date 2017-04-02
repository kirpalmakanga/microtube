import { IndexRoute, Route } from 'react-router'

import App from './components/App.jsx'
import Playlists from './components/playlists/Playlists.jsx'
import PlaylistItems from './components/playlists/PlaylistItems.jsx'
import Subscriptions from './components/subscriptions/Subscriptions.jsx'
import Channel from './components/Channel.jsx'

export default function getRoutes ({ dispatch }) {
  return (
    <Route path='/' component={App}>
      <IndexRoute component={Playlists} />
       <Route path='/playlist/:id' component={PlaylistItems} onLeave={() => dispatch({ type: 'CLEAR_PLAYLIST_ITEMS' })}/>
       <Route path='/subscriptions' component={Subscriptions} />
       <Route path='/channel/:id' component={Channel} onLeave={() => dispatch({ type: 'CLEAR_CHANNEL_VIDEOS' })}/>
    </Route>
  )
}
