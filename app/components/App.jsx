require('../assets/styles/app.scss')

import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Match from 'preact-router/match'

import Header from './header/HeaderContainer.jsx'
import Search from './containers/Search.jsx'
import Player from './containers/Player.jsx'
import Notifications from './Notifications.jsx'
import Prompt from './Prompt.jsx'

import GoogleLogin from './auth/GoogleLogin.jsx'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      path: location.pathname
    }
  }

  handleSignIn = (data) => this.props.dispatch({ type: 'SIGN_IN', data })

  render({ children, auth, notifications }, { path }) {
    return (
      <div class='layout'>
        <Match>
          {({ path }) => (<Header path={path} />)}
        </Match>

        <main class='layout__content'>
          {auth.isSignedIn ? children : (
            <div class='log_in'>
              <GoogleLogin className='button' onSuccess={this.handleSignIn}>Log in</GoogleLogin>
            </div>
          )}
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
