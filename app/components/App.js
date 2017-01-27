// jshint esversion: 6, asi: true
// eslint-env es6

require('../../assets/styles/app.scss')

import Header from './header/HeaderContainer'
import PlaylistItems from './playlists/PlaylistItems'
import Search from './search/Search'
import PlayerContainer from './player/PlayerContainer'
import Notifications from './Notifications'
import Prompt from './Prompt'

const { connect } = ReactRedux

const App = ({ children, auth, dispatch }) => {
  return (
    <div className='mdl-layout'>
      <Header />

      <main className='mdl-layout__content'>
        {auth.token ? children : null}
      </main>

      <PlaylistItems />

      <Search />

      <PlayerContainer />

      <Notifications />

      <Prompt />
    </div>
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(App)
