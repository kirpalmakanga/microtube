require('../assets/styles/app.scss')

import FastClick from 'react-fastclick-alt'
import Header from './header/HeaderContainer.jsx'
import Search from './containers/Search.jsx'
import Player from './containers/Player.jsx'
import Notifications from './Notifications.jsx'
import Prompt from './Prompt.jsx'

const { connect } = ReactRedux

const App = ({ children, location, auth }) => {
  return (
    <FastClick>
      <div className='layout'>
        <Header path={location.pathname}/>

        <main className='layout__content'>
          {auth.token ? children : null}
        </main>

        <Search />

        <Player />

        <Notifications />

        <Prompt />
      </div>
    </FastClick>
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(App)
