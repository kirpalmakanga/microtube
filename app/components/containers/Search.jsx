import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { searchVideos } from '../../actions/youtube'

import Grid from '../Grid'

import VideoCard from '../cards/VideoCard'

class Search extends Component {
  componentWillUnmount() {
    this.props.dispatch({ type: 'CLEAR_SEARCH' })
  }

  render({ search, dispatch }) {
    const { query, items, nextPageToken } = search

    return (
      <Grid
        items={items}
        loadContent={() => query && dispatch(
          searchVideos({
            query,
            pageToken: nextPageToken
          })
        )}
        ItemComponent={VideoCard}
      />
    )
  }
}

const mapStateToProps = ({ search }) => ({ search })

export default connect(mapStateToProps)(Search)
