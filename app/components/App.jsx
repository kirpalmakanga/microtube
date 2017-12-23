require('../assets/styles/app.scss')

import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import { route } from 'preact-router'
import Match from 'preact-router/match'

import Header from './header/HeaderContainer'
import Player from './containers/Player'
import Notifications from './Notifications'
import Prompt from './Prompt'


class App extends Component {
  render({ children, auth: { isSignedIn }, notifications }) {
    return (
      <div class='layout'>
        <Match>
          {({ path }) => {
            if (!isSignedIn && path !== '/login') {
              route('/login', true)
            } else if (isSignedIn && path === '/login') {
              route('/', true)
            }

            return (<Header path={path} />)
          }}
        </Match>

        <main class='layout__content'>
          {isSignedIn ? children : null}
        </main>

        <Player />

        <Prompt />

        {notifications.message ? (<Notifications />) : null}
      </div>
    )
  }
}

const mapStateToProps = (({ auth, notifications }) => ({ auth, notifications }))

export default connect(mapStateToProps)(App)
