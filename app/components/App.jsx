require('../assets/styles/app.scss')

import FastClick from 'react-fastclick-alt';
import Header from './header/HeaderContainer.jsx'
import PlaylistItems from './playlists/PlaylistItems.jsx'
import Search from './search/Search.jsx'
import PlayerContainer from './player/PlayerContainer.jsx'
import Notifications from './Notifications.jsx'
import Prompt from './Prompt.jsx'

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
