// jshint esversion: 6, asi: true
// eslint-env es6

require('../../assets/styles/app.scss')

import React from 'react'

import Header from './Header'
import PlayerContainer from './player/PlayerContainer'
import Notifications from './notifications/Notifications'
import Prompt from './Prompt'
import Search from './search/Search'
import PlaylistItems from './playlists/PlaylistItems'
import cookie from 'react-cookie'

import connect from 'react-redux/lib/components/connect'

const App = ({ children, notifications, auth, menu, player, dispatch }) => {
  return (
    <div className='mdl-layout'>
      <Header />

      <main className='mdl-layout__content'>
        {auth.token ? children : null}
      </main>

      <Search />

      <PlaylistItems />

      <PlayerContainer />

      <Notifications notifications={notifications} />

      <Prompt />
    </div>
  )
}

const mapStateToProps = ({ auth, menu, player, notifications }) => ({ auth, menu, player, notifications })

export default connect(mapStateToProps)(App)
