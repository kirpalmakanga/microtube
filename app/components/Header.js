// jshint esversion: 6, asi: true
// eslint-env es6

import React from 'react'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import { IndexLink, Link } from 'react-router'
import { logIn } from '../actions/auth'
import SearchForm from './search/SearchForm.js'

const Header = ({ auth, playlists, playlistItems, player, search, dispatch }) => {

  function getTitle() {
    return playlistItems.isOpen ? playlistItems.title : 'Youtube Lite'
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

  function closeQueue() {
    dispatch({ type: 'QUEUE_CLOSE' })
  }

  function closePlaylist() {
    dispatch({ type: 'PLAYLIST_CLOSE' })
  }

  return (
    <header className='mdl-layout__header'>
      {search.isOpen ? (
        <div className='mdl-layout__header-row'>
          <button
            className='mdl-layout__drawer-button'
            onClick={closeSearch}
          >
              <svg><use xlinkHref='#icon-back'></use></svg>
          </button>
          <SearchForm />
        </div>
      ) : player.showQueue ? (
        <div className='mdl-layout__header-row'>
          <button
            className='mdl-layout__drawer-button'
            onClick={closeQueue}
          >
              <svg><use xlinkHref='#icon-back'></use></svg>
          </button>
          <span className='mdl-layout-title'>{'Queue (' + player.queue.length + ' Elements)'}</span>
          <div className='mdl-layout-spacer'></div>
          <nav className='mdl-navigation'>
            <button className='mdl-navigation__link' onClick={() => {
              dispatch({
                type: 'PROMPT_CLEAR_QUEUE',
                callback: () => {
                  dispatch({ type: 'QUEUE_CLEAR' })
                  dispatch({ type: 'PROMPT_CLOSE' })
                }
              })
            }}>
              <svg><use xlinkHref='#icon-clear'></use></svg>
            </button>
          </nav>
        </div>
      ) : (

        <div className='mdl-layout__header-row'>
          {playlistItems.isOpen || player.showQueue ? (
            <button
              className='mdl-layout__drawer-button'
              onClick={closePlaylist}
            >
              <svg><use xlinkHref='#icon-back'></use></svg>
            </button>
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
const mapStateToProps = ({ auth, playlists, playlistItems, player, search }) => ({ auth, playlists, playlistItems, player, search })

export default connect(mapStateToProps)(Header)
