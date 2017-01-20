// jshint esversion: 6, asi:true
// eslint-env es6

import React from 'react'
import { getData } from './actions/database'

import { IndexRoute, Route } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import Search from './components/search/Search'
import Playlists from './components/playlists/Playlists'
import PlaylistItems from './components/playlists/PlaylistItems'
import NotFound from './components/NotFound'

export default function getRoutes ({ dispatch }) {

  const clearNotifications = () => dispatch({ type: 'CLEAR_NOTIFICATIONS' })

  const clearPlaylistItems = () => dispatch({ type: 'CLEAR_PLAYLIST_ITEMS' })

  const clearSearch = () => dispatch({ type: 'CLEAR_SEARCH' })

  return (
    <Route path='/' component={App}>
      <IndexRoute component={Playlists} />
      // <Route path='/search' component={Search} onEnter={clearSearch}/>
      // <Route path='/playlists' component={Playlists} />
      // <Route path='/playlists/:id' component={PlaylistItems} onEnter={clearPlaylistItems} />
      // <Route path='*' component={NotFound} onLeave={clearNotifications} />
    </Route>
  )
}
