import Waypoint from 'react-waypoint'
import VideoCard from '../cards/VideoCard.jsx'

import { searchVideos } from '../../actions/database'

const { connect } = ReactRedux

const Search = ({ auth, search, dispatch }) => {
  const nextPage = search.pages[search.pages.length - 1] || ''

  function loadMoreContent () {
    dispatch(searchVideos(auth.token, search.query, nextPage))
  }

  function renderWaypoint() {
    if (nextPage && search.isLoading !== 2) {
      return (
        <Waypoint onEnter={loadMoreContent}/>
      )
    }
  }

  return (
    <div className={['search', search.isOpen ? 'search--show': '', 'shadow--2dp'].join(' ')}>
      <div className='grid'>
        {search.items.map((video, i) => (
          <div key={i} className='grid__item'>
            <VideoCard video={video} />
          </div>
        ))}

        <div className={['grid__loading', search.isLoading === 1 ? 'is-active': ''].join(' ')}>
          {renderWaypoint()}
          <svg className='rotating'><use xlinkHref='#icon-loading'></use></svg>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ auth, search }) => ({ auth, search })

export default connect(mapStateToProps)(Search)
