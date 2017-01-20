// jshint esversion: 6, asi: true
// eslint-env es6
import React from 'react'
import { searchVideos } from '../../actions/database'
import VideoCard from '../playlists/VideoCard'
import Waypoint from 'react-waypoint'
import { connect } from 'react-redux'

const Search = ({ auth, search, dispatch }) => {
  const nextPage = search.pages[search.pages.length - 1] || ''

  function loadMoreContent () {
    dispatch(searchVideos(auth.token, search.query, nextPage))
  }

  function renderWaypoint() {
    if (nextPage && search.isLoading !== 2) {
      return (
        <Waypoint
          onEnter={loadMoreContent}
        />
      )
    }
  }

  return (
    <div className={['search', search.isOpen ? 'search--show': ''].join(' ')}>
      <div className='mdl-grid'>
        {search.items.map((video, i) => (
          <div key={i} className='mdl-cell mdl-cell--12-col-phone mdl-cell--12-col-tablet mdl-cell--12-col'>
            <VideoCard video={video} />
          </div>
        ))}

        <div className={['mdl-grid__loading', search.isLoading === 1 ? 'is-active': ''].join(' ')}>
          <svg className='loading'><use xlinkHref='#icon-loading'></use></svg>
        </div>

        {renderWaypoint()}
      </div>
    </div>
  )
}

const mapStateToProps = ({ auth, search }) => ({ auth, search })

export default connect(mapStateToProps)(Search)
