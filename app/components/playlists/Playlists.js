// jshint esversion: 6, asi: true
// eslint-env es6



import { getPlaylists } from '../../actions/database'
import PlaylistCard from './PlaylistCard.js'
import Waypoint from 'react-waypoint'
const { connect } = ReactRedux

const Playlists = ({ auth, playlists, dispatch }) => {
  const nextPage = playlists.pages[playlists.pages.length - 1] || ''

  console.log('access token', auth.token)

  function loadMoreContent () {
    dispatch(getPlaylists(auth.token))
  }

  function renderWaypoint() {
    if (auth.token && playlists.isLoading !== 2) {
      return (
        <Waypoint
          onEnter={loadMoreContent}
          topOffset={1}
        />
      )
    }
  }

  return (
    <div className='mdl-grid'>
      {playlists.items.map(({id, title}, i) => (
        <div key={i} className='mdl-cell mdl-cell--12-col-phone mdl-cell--12-col-tablet mdl-cell--12-col'>
          <PlaylistCard id={id} title={title} />
        </div>
      ))}

      <div className={['mdl-grid__loading', playlists.isLoading === 1 ? 'is-active': ''].join(' ')}>
        <svg className='loading'><use xlinkHref='#icon-loading'></use></svg>
      </div>

      {renderWaypoint()}
    </div>
  )
}

const mapStateToProps = ({ auth, playlists }) => ({ auth, playlists })

export default connect(mapStateToProps)(Playlists)
