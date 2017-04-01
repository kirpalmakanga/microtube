import Waypoint from 'react-waypoint'
import { getPlaylists, getAllPlaylists } from '../../actions/database'
import PlaylistCard from './PlaylistCard.jsx'

const { connect } = ReactRedux

const Playlists = ({ auth, playlists, dispatch }) => {
  function loadMoreContent () {
    dispatch(getAllPlaylists(auth.token))
  }

  function renderWaypoint() {
    if (auth.token && playlists.isLoading !== 2) {
      return (<Waypoint onEnter={loadMoreContent} topOffset={1} />)
    }
  }

  return (
    <div className='grid'>
      {playlists.items.map((data, i) => (
        <div key={i} className='grid__item'>
          <PlaylistCard {...data} />
        </div>
      ))}

      <div className={['grid__loading', auth.token && playlists.isLoading === 1 ? 'is-active': ''].join(' ')}>
        <svg className='rotating'><use xlinkHref='#icon-loading'></use></svg>
      </div>

      {renderWaypoint()}
    </div>
  )
}

const mapStateToProps = ({ auth, playlists }) => ({ auth, playlists })

export default connect(mapStateToProps)(Playlists)
