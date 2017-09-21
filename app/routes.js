import { IndexRoute, Route } from 'react-router'

export default function getRoutes({ getState, dispatch }) {
  function refreshToken() {
    const requestToken = async (callback = () => null) => {
      const { auth } = getState()

      if (!auth.refresh) {
        return callback()
      }

      const token = await refreshAccessToken(auth.refresh)

      if (token) {
        dispatch({ type: 'OAUTH_REFRESH', data: { token } })
      }
    }

    const refreshWatcher = setInterval(() => requestToken(() => clearInterval(refreshWatcher)), 3540000)

    requestToken()
  }

  return (
    <Route path='/' onEnter={refreshToken} component={App}>
      <IndexRoute component={Playlists}/>
      <Route path='/playlist/:id' component={Playlist} onLeave={() => dispatch({type: 'CLEAR_PLAYLIST_ITEMS'})}/>
      <Route path='/subscriptions' component={Subscriptions}/>
      <Route path='/channel/:id' component={Channel} onLeave={() => dispatch({type: 'CLEAR_CHANNEL_VIDEOS'})}/>
    </Route>
  )
}
