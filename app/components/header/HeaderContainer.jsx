import { IndexLink, Link } from 'react-router'
import { logIn } from '../../actions/auth'
import { getVideo } from '../../actions/database'
import SearchHeader from './SearchHeader.jsx'
import QueueHeader from './QueueHeader.jsx'
import SearchForm from '../search/SearchForm.jsx'

const { connect } = ReactRedux

const Header = ({ auth, playlistItems, player, search, path, dispatch }) => {
  const isHome = (path === '/')
  function handleConnection() {
    if (auth.token) {
      clearInterval(auth.refreshWatcher)
      dispatch({ type: 'UNLINK' })
      dispatch({ type: 'NOTIFY', data: 'Déconnecté.' })
      return
    }
    dispatch(logIn())
  }

  return (
    <header className='layout__header shadow--2dp'>
      {player.showQueue ? (
        <QueueHeader />
      ) : search.isOpen ? (
        <SearchHeader />
      ) : (
        <div className='layout__header-row'>
          {!isHome ? (
            <Link className='layout__back-button icon-button' to='/'>
              <span className='icon'>
                <svg><use xlinkHref='#icon-back'></use></svg>
              </span>
            </Link>
          ) : null}

          <span className='layout-title'>{playlistItems.playlistTitle || 'MicroTube'}</span>

          <nav className='navigation'>
            <button
              className='navigation__link icon-button'
              onClick={() => {
                dispatch({ type: 'SCREEN_CLOSE' })

                dispatch({ type: 'QUEUE_CLOSE' })

                dispatch({ type: 'SEARCH_OPEN' })
              }}
            >
              <span className='icon'>
                <svg><use xlinkHref='#icon-search'></use></svg>
              </span>
            </button>

            <Link className='navigation__link icon-button' to='/subscriptions'>
              <span className='icon'>
                <svg><use xlinkHref='#icon-subscriptions'></use></svg>
              </span>
            </Link>

            <button className='navigation__link icon-button' onClick={handleConnection}>
              {auth.token ? (
                <img src={auth.user.picture} />
              ) : (
                <span className='icon'>
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
const mapStateToProps = ({ auth, playlistItems, player, search }) => ({ auth, playlistItems, player, search })

export default connect(mapStateToProps)(Header)
