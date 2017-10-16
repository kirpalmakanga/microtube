require('../assets/styles/app.scss')

import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Match from 'preact-router/match'

import Header from './header/HeaderContainer.jsx'
import Search from './containers/Search.jsx'
import Player from './containers/Player.jsx'
import Notifications from './Notifications.jsx'
import Prompt from './Prompt.jsx'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      path: location.pathname
    }
  }

  render({ children, auth, notifications }, { path }) {
    return (
      <div class='layout'>
        <Match>
          {({ path }) => (<Header path={path} />)}
        </Match>

        <main class='layout__content'>
          {auth.isSignedIn ? children : null}
        </main>

        <Search />

        <Player />

        <Prompt />

        {notifications.message ? (<Notifications />) : null}
      </div>
    )
  }
}

const mapStateToProps = (({ auth, notifications }) => ({ auth, notifications }))

export default connect(mapStateToProps)(App)
