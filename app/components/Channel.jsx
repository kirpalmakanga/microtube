import { getChannelVideos } from '../actions/database'
import VideoCard from './playlists/VideoCard.jsx'
import Waypoint from 'react-waypoint'
const { connect } = ReactRedux

const Channel = ({ auth, channel, params, dispatch }) => {
  const nextPage = channel.pages[channel.pages.length - 1] || ''

  function loadMoreContent () {
    dispatch(getChannelVideos(auth.token, params.id, nextPage))
  }

  function renderWaypoint() {
    if (auth.token && channel.isLoading !== 2) {
      return (<Waypoint onEnter={loadMoreContent} topOffset={1} />)
    }
  }

  return (
    <div className='grid'>
      {channel.items.map((data, i) => (
        <div key={i} className='grid__item'>
          <VideoCard video={data} />
        </div>
      ))}

      <div className={['grid__loading', auth.token && channel.isLoading === 1 ? 'is-active': ''].join(' ')}>
        {renderWaypoint()}
        <svg className='rotating'><use xlinkHref='#icon-loading'></use></svg>
      </div>
    </div>
  )
}


const mapStateToProps = ({ auth, channel }) => ({ auth, channel })

export default connect(mapStateToProps)(Channel)
