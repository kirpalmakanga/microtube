// jshint esversion: 6, asi: true
// eslint-env es6
import React from 'react'
import { getPlaylistItems } from '../../actions/database'
import VideoCard from './VideoCard'
import Waypoint from 'react-waypoint'
import { connect } from 'react-redux'

const PlaylistItems = ({ auth, playlistItems, dispatch }) => {
  const playlistId = playlistItems.playlistId
  const nextPage = playlistItems.pages[playlistItems.pages.length - 1] || ''

  console.log('playlistItems', playlistItems)

  function loadMoreContent () {
    dispatch(getPlaylistItems(auth.token, playlistId))
  }

  function renderWaypoint() {
    if (playlistItems.isLoading !== 2) {
      return (
        <Waypoint
          onEnter={loadMoreContent}
        />
      )
    }
  }

  return (
    <div className='mdl-grid'>
      {playlistItems.items.map((video, i) => (
        <div key={i} className='mdl-cell mdl-cell--12-col-phone mdl-cell--12-col-tablet mdl-cell--12-col'>
          <VideoCard video={video} />
        </div>
      ))}

      <div className={['mdl-grid__loading', playlistItems.isLoading === 1 ? 'is-active': ''].join(' ')}>
        <svg className='loading'><use xlinkHref='#icon-loading'></use></svg>
      </div>

      {renderWaypoint()}
    </div>
  )
}

const mapStateToProps = ({ auth, playlistItems }) => ({ auth, playlistItems })

export default connect(mapStateToProps)(PlaylistItems)
