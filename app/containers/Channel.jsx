import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getChannelVideos } from 'actions/youtube'

import Grid from 'components/Grid'

import VideoCard from 'components/cards/VideoCard'

class Channel extends Component {
  componentWillUnmount() {
    this.props.dispatch({ type: 'CLEAR_CHANNEL_ITEMS' })
  }

  render({ channelId, channel, dispatch }) {
    const { items, nextPageToken: pageToken } = channel

    return (
      <Grid
        items={items}
        loadContent={() => pageToken !== null && dispatch(
          getChannelVideos({
            channelId,
            pageToken
          })
        )}
        ItemComponent={VideoCard}
      />
    )
  }
}

const mapStateToProps = ({ channel }) => ({ channel })

export default connect(mapStateToProps)(Channel)
