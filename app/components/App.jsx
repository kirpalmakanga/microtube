require('../assets/styles/app.scss')

import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Header from './header/HeaderContainer.jsx'
import Search from './containers/Search.jsx'
import Player from './containers/Player.jsx'
import Notifications from './Notifications.jsx'
import Prompt from './Prompt.jsx'

import { refreshAccessToken } from '../actions/auth'

import createHistory from 'history/createBrowserHistory'

const history = createHistory()

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      path: location.pathname
    }
  }

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

  componentDidMount = () => {
    history.listen(({ pathname, state }, action) => {
      this.setState({ path: pathname || '/' })
      console.log(action, pathname, state)
    })

    this.refreshAuthToken()
  }

  render({ children, auth, notifications }, { path }) {
    return (
      <div class='layout'>
        <Header path={path} />

        <main class='layout__content'>
          {auth.token ? children : null}
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
