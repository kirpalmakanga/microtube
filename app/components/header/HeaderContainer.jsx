import { h, render, Component } from 'preact'
import { connect } from 'preact-redux'
import { Link } from 'preact-router/match'
import { logIn } from '../../actions/auth'
import { getVideo } from '../../actions/database'
import api from '../../api/youtube'

import SearchHeader from './SearchHeader.jsx'
import QueueHeader from './QueueHeader.jsx'
import SearchForm from '../SearchForm.jsx'

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
      title = await api.getChannelTitle(auth.token, path.slice(1).split('/')[1])
    }

    if (path.includes('/playlist')) {
      title = await api.getPlaylistTitle(auth.token, path.slice(1).split('/')[1])
    }

    this.setState({ title })
  }

  openSearchForm = () => {
    const { dispatch } = this.props

    dispatch({ type: 'SCREEN_CLOSE' })

    dispatch({ type: 'QUEUE_CLOSE' })

    dispatch({ type: 'SEARCH_OPEN' })
  }

  handleConnection = () => {
    const { auth, dispatch } = this.props

    if (auth.token) {
      clearInterval(auth.refreshWatcher)
      dispatch({ type: 'UNLINK' })
      dispatch({ type: 'NOTIFY', data: 'Déconnecté.' })
      return
    }

    dispatch(logIn())
  }

  render ({ auth, playlistItems, player, search, path, dispatch }, { title }) {
    return (
      <header class='layout__header shadow--2dp'>
        {player.showQueue ? (
          <QueueHeader />
        ) : search.isOpen ? (
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
              <button
                class='navigation__link icon-button'
                aria-label='Open search'
                onClick={this.openSearchForm}
              >
                <span class='icon'>
                  <svg><use xlinkHref='#icon-search'></use></svg>
                </span>
              </button>

              <Link class='navigation__link icon-button' href='/subscriptions' aria-label='Open subscriptions'>
                <span class='icon'>
                  <svg><use xlinkHref='#icon-subscriptions'></use></svg>
                </span>
              </Link>

              <button class='navigation__link icon-button' onClick={this.handleConnection} aria-label={auth.token ? 'Log in' : 'Log out'}>
                {auth.token ? (
                  <img src={auth.user.picture} />
                ) : (
                  <span class='icon'>
                    <svg><use xlinkHref='#icon-user'></use></svg>
                  </span>
                )}
              </button>
            </nav>
          </div>
        )}
      </header>
    )
  }
}

const mapStateToProps = ({ auth, playlistItems, player, search }) => ({ auth, playlistItems, player, search })

export default connect(mapStateToProps)(Header)
