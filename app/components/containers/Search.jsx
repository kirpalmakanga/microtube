import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Waypoint from 'preact-waypoint'

import VideoCard from '../cards/VideoCard'

import { searchVideos } from '../../actions/database'


class Search extends Component {
  getNextPage = () => {
    const { search } = this.props

    search.pages[search.pages.length - 1]
  }

  loadMoreContent = () => {
    const { auth, search, dispatch } = this.props
    dispatch(searchVideos(auth.token, search.query, this.getNextPage()))
  }

  render({ auth, search }) {
    return (
      <div className={['search', search.isOpen ? 'search--show': '', 'shadow--2dp'].join(' ')}>
        <div className='grid'>
          {search.items.map((data, i) => (
            <div key={i} className='grid__item'>
              <VideoCard {...data} />
            </div>
          ))}

          <div className={['grid__loading', search.isLoading === 1 ? 'is-active': ''].join(' ')}>
            {this.container ? (<Waypoint container={this.container} onEnter={this.loadMoreContent} />) : null}
            <svg className='rotating'><use xlinkHref='#icon-loading'></use></svg>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth, search }) => ({ auth, search })

export default connect(mapStateToProps)(Search)
