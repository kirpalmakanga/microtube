require('../../assets/styles/app.scss')

import FastClick from 'react-fastclick-alt';
import Header from './header/HeaderContainer'
import PlaylistItems from './playlists/PlaylistItems'
import Search from './search/Search'
import PlayerContainer from './player/PlayerContainer'
import Notifications from './Notifications'
import Prompt from './Prompt'

const { connect } = ReactRedux

const App = ({ children, auth }) => {
  return (
    <FastClick>
      <div className='layout'>
        <Header />

        <main className='layout__content'>
          {auth.token ? children : null}
        </main>

        <PlaylistItems />

        <Search />

        <PlayerContainer />

        <Notifications />

        <Prompt />
      </div>
    </FastClick>
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(App)
