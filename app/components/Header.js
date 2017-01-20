// jshint esversion: 6, asi: true
// eslint-env es6

import React from 'react'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import { IndexLink, Link } from 'react-router'
import { logIn } from '../actions/database'
import SearchForm from './search/SearchForm.js'

const Header = ({ auth, playlists, player, search, pathName, dispatch }) => {
  const [ , path, pathId] = pathName.split('/')

  function getTitle() {
    function getPlaylistTitle(playlistId) {
      const item = playlists.items.find(({ id }) => id === playlistId)

      return item ? item.title : 'Playlists'
    }

    switch (path) {
      case 'search':
        return 'Search';

      case 'playlists':
        return getPlaylistTitle(pathId)

      default:
        return 'Youtube Lite'
    }
  }

  function isAuthenticated () {
    return auth.token
  }

  function logOut() {
    dispatch({
      type: 'UNLINK'
    })
  }

  function closePanels() {
    if (player.showScreen) {
      dispatch({ type: 'SCREEN_CLOSE' })
    }

    if (player.showQueue) {
      dispatch({ type: 'QUEUE_CLOSE' })
    }
  }

  function openSearch() {
    closePanels()

    dispatch({ type: 'SEARCH_OPEN' })
  }

  function closeSearch() {
    dispatch({ type: 'SEARCH_CLOSE' })
  }

  return (
    <header className='mdl-layout__header'>
      {search.isOpen ? (
        <div className='mdl-layout__header-row'>
          <button tabIndex='0' className='mdl-layout__drawer-button'
            onClick={closeSearch}
          >
              <svg><use xlinkHref='#icon-back'></use></svg>
          </button>
          <SearchForm />
        </div>
      ) : (
        <div className='mdl-layout__header-row'>
          {pathId ? (
            <Link className='mdl-layout__drawer-button' to='/'>
              <svg><use xlinkHref='#icon-back'></use></svg>
            </Link>
          ) : null}

          <span className='mdl-layout-title'>{getTitle()}</span>

          <div className='mdl-layout-spacer'></div>
          <nav className='mdl-navigation'>
            <button className='mdl-navigation__link' onClick={openSearch}>
              <svg><use xlinkHref='#icon-search'></use></svg>
            </button>

            <button className='mdl-navigation__link' onClick={isAuthenticated() ? logOut : () => dispatch(logIn()) }>
              {isAuthenticated() ? (
                <svg><use xlinkHref='#icon-exit'></use></svg>
              ) : (
                <svg><use xlinkHref='#icon-user'></use></svg>
              )}
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
const mapStateToProps = ({ auth, playlists, player, search }) => ({ auth, playlists, player, search })

export default connect(mapStateToProps)(Header)
