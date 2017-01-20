// jshint esversion: 6, asi: true
// eslint-env es6
import React from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { getPlaylistItems } from '../../actions/database'

const PlaylistCard = ({ auth, id, title, dispatch }) => {
  function openPlaylist() {
    dispatch({
      type: 'PLAYLIST_OPEN',
      playlistId: id
    })
  }
  return (
    <div className='card mdl-shadow--2dp'>
      <div className='card__text' onClick={openPlaylist}>
        <h2 className='card__text-title'>{title}</h2>
        <p className='card__text-subtitle'></p>
      </div>

      <button className='card__button' type='button' onClick={() => dispatch(getPlaylistItems(auth.token, id))}>
        <svg><use xlinkHref='#icon-queue'></use></svg>
      </button>

      <button className='card__button' type='button' onClick={() => dispatch(getPlaylistItems(auth.token, id, true))}>
        <svg><use xlinkHref='#icon-play'></use></svg>
      </button>
    </div>
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(PlaylistCard)
