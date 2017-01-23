// jshint esversion: 6, asi: true
// eslint-env es6

require('../../assets/styles/app.scss')



import Header from './Header'
import PlayerContainer from './player/PlayerContainer'
import Notifications from './notifications/Notifications'
import Prompt from './Prompt'
import Search from './search/Search'
import PlaylistItems from './playlists/PlaylistItems'
import cookie from 'react-cookie'

const { connect } = ReactRedux

const App = ({ children, notifications, auth, menu, player, dispatch }) => {
  return (
    <div className='mdl-layout'>
      <Header />

      <main className='mdl-layout__content'>
        {auth.token ? children : null}
      </main>

      <PlaylistItems />

      <Search />

      <PlayerContainer />

      <Notifications notifications={notifications} />

      <Prompt />
    </div>
  )
}

const mapStateToProps = ({ auth, menu, player, notifications }) => ({ auth, menu, player, notifications })

export default connect(mapStateToProps)(App)
