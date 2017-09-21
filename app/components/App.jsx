require('../assets/styles/app.scss')

import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Header from './header/HeaderContainer.jsx'
import Search from './containers/Search.jsx'
import Player from './containers/Player.jsx'
// import Notifications from './Notifications.jsx'
import Prompt from './Prompt.jsx'

import { refreshAccessToken } from '../actions/auth'

class App extends Component {

  refreshAuthToken() {
    const { auth, dispatch } = this.props

    const requestToken = async (callback = () => null) => {
      if (!auth.refresh) {
        return callback()
      }

      const token = await refreshAccessToken(auth.refresh)

      if (token) {
        dispatch({ type: 'OAUTH_REFRESH', data: { token } })
      }
    }

    const refreshWatcher = setInterval(() => requestToken(() => clearInterval(refreshWatcher)), 3540000)

    requestToken()
  }

  componentDidMount = () => this.refreshAuthToken()

  render({ children, auth }) {
    return (
      <div class='layout'>
        <Header path={location.pathname}/>

        <main class='layout__content'>
          {auth.token ? children : null}
        </main>

        <Search />

        <Player />

        <Prompt />
      </div>
    )
  }
}

const mapStateToProps = (({ auth }) => ({ auth }))

export default connect(mapStateToProps)(App)
