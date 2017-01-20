// jshint esversion: 6, asi: true
// eslint-env es6

require('../../assets/styles/app.scss')

import React from 'react'
import Header from './Header'
import PlayerContainer from './player/PlayerContainer'
import Notifications from './notifications/Notifications'
import Waypoint from 'react-waypoint'
import Prompt from './Prompt'
import Search from './search/Search'
import PlaylistItems from './playlists/PlaylistItems'
import cookie from 'react-cookie'

import { connect } from 'react-redux'

const App = ({ location, children, notifications, auth, menu, dispatch }) => {
  return (
    <div className='mdl-layout'>
      <Header pathName={location.pathname} />

      <main className='mdl-layout__content'>
        {auth.token ? children : null}
      </main>

      <Search />

      <PlayerContainer />

      <Notifications notifications={notifications} />

      <Prompt />
    </div>
  )
}

const mapStateToProps = ({ auth, menu, notifications }) => ({ auth, menu, notifications })

export default connect(mapStateToProps)(App)
