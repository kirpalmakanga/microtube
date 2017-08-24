import Waypoint from 'react-waypoint'
import PlaylistCard from '../cards/PlaylistCard.jsx'

import { getPlaylists } from '../../actions/database'

const { connect } = ReactRedux

const Playlists = ({ auth, playlists, dispatch }) => {
  const nextPage = playlists.pages[playlists.pages.length - 1]

  function loadMoreContent () {
    dispatch(getPlaylists(auth.token, nextPage))
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
        {renderWaypoint()}
        <svg className='rotating'><use xlinkHref='#icon-loading'></use></svg>
      </div>
    </div>
  )
}

const mapStateToProps = ({ auth, playlists }) => ({ auth, playlists })

export default connect(mapStateToProps)(Playlists)
