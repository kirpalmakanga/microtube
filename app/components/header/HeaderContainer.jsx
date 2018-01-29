import { h, render, Component } from 'preact'
import { connect } from 'preact-redux'
import { Link } from 'preact-router/match'

import { getPlaylistTitle, getChannelTitle, getChannelId } from '../../api/youtube'
import { signIn } from '../../actions/auth'

import QueueHeader from './QueueHeader'
import SearchHeader from './SearchHeader'
import SearchForm from '../SearchForm'

import GoogleLogin from '../auth/GoogleLogin'
import GoogleLogout from '../auth/GoogleLogout'

const initialState = {
  title: 'MicroTube'
}

class Header extends Component {
  constructor(props) {
      super(props)

      this.state = initialState
  }

  componentWillReceiveProps = async ({ auth, path }) => {
    let title = 'MicroTube'

    if (path.includes('/subscriptions')) {
      title = 'Subscriptions'
    }

    if (path.includes('/channel')) {
      title = await getChannelTitle(path.slice(1).split('/')[1])
    }

    if (path.includes('/playlist')) {
      title = await getPlaylistTitle(path.slice(1).split('/')[1])
    }

    this.setState({ title })
  }

  openSearchForm = () => {
    const { dispatch } = this.props

    dispatch({ type: 'SCREEN_CLOSE' })

    dispatch({ type: 'QUEUE_CLOSE' })

    dispatch({ type: 'SEARCH_OPEN' })
  }

  handleSignIn = async (data) => await this.props.dispatch(signIn(data))

  handleSignOut = () => this.props.dispatch({ type: 'SIGN_OUT' })

  render ({ auth: { isSignedIn, user: { picture } }, player, path, dispatch }, { title }) {
    return (
      <header class='layout__header shadow--2dp'>
        {player.showQueue ? (
          <QueueHeader />
        ) : path.includes('/search') ? (
          <SearchHeader />
        ) : (
          <div class='layout__header-row'>
            {path !== '/' ? (
              <Link class='layout__back-button icon-button' href='/' aria-label='Go to homepage'>
                <span class='icon'>
                  <svg><use xlinkHref='#icon-back'></use></svg>
                </span>
              </Link>
            ) : null}

            <span class='layout-title'>{title}</span>

            <nav class='navigation'>
              <Link
                class='navigation__link icon-button'
                aria-label='Open search'
                href='/search'
              >
                <span class='icon'>
                  <svg><use xlinkHref='#icon-search'></use></svg>
                </span>
              </Link>

              <Link class='navigation__link icon-button' href='/subscriptions' aria-label='Open subscriptions'>
                <span class='icon'>
                  <svg><use xlinkHref='#icon-subscriptions'></use></svg>
                </span>
              </Link>
              
              {isSignedIn ? (
                <GoogleLogout className='navigation__link icon-button' onSuccess={this.handleSignOut}>
                  <img src={picture} />
                </GoogleLogout>
              ) : (
                <GoogleLogin className='navigation__link icon-button' onSuccess={this.handleSignIn}>
                  <span class='icon'>
                    <svg><use xlinkHref='#icon-account'></use></svg>
                  </span>
                </GoogleLogin>
              )}
            </nav>
          </div>
        )}
      </header>
    )
  }
}

const mapStateToProps = ({ auth, player }) => ({ auth, player })

export default connect(mapStateToProps)(Header)
