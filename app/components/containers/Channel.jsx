import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getChannelVideos } from '../../actions/youtube'

import Grid from '../Grid'

import VideoCard from '../cards/VideoCard'

class Channel extends Component {
  componentWillUnmount() {
    this.props.dispatch({ type: 'CLEAR_CHANNEL_ITEMS' })
  }

  render({ id, channel, dispatch }) {
    const { items, nextPageToken } = channel

    return (
      <Grid
        items={items}
        loadContent={() => nextPageToken !== null && dispatch(
          getChannelVideos({
            channelId: id,
            pageToken: nextPageToken
          })
        )}
        ItemComponent={VideoCard}
      />
    )
  }
}

const mapStateToProps = ({ channel }) => ({ channel })

export default connect(mapStateToProps)(Channel)
