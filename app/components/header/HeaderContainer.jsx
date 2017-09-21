import { h, render, Component } from 'preact'
import { connect } from 'preact-redux'
import { Link } from 'preact-router/match'
import { logIn } from '../../actions/auth'
import { getVideo } from '../../actions/database'


import SearchHeader from './SearchHeader.jsx'
import QueueHeader from './QueueHeader.jsx'
import SearchForm from '../SearchForm.jsx'

class Header extends Component {
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

  render ({ auth, playlistItems, player, search, path, dispatch }) {
    return (
      <header class='layout__header shadow--2dp'>
        {player.showQueue ? (
          <QueueHeader />
        ) : search.isOpen ? (
          <SearchHeader />
        ) : (
          <div class='layout__header-row'>
            {!path === '/' ? (
              <Link class='layout__back-button icon-button' href='/'>
                <span class='icon'>
                  <svg><use xlinkHref='#icon-back'></use></svg>
                </span>
              </Link>
            ) : null}

            <span class='layout-title'>{playlistItems.playlistTitle || 'MicroTube'}</span>

            <nav class='navigation'>
              <button
                class='navigation__link icon-button'
                onClick={this.openSearchForm}
              >
                <span class='icon'>
                  <svg><use xlinkHref='#icon-search'></use></svg>
                </span>
              </button>

              <Link class='navigation__link icon-button' href='/subscriptions'>
                <span class='icon'>
                  <svg><use xlinkHref='#icon-subscriptions'></use></svg>
                </span>
              </Link>

              <button class='navigation__link icon-button' onClick={this.handleConnection}>
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
