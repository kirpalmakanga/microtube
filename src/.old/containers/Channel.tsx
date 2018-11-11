import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getChannelVideos } from 'actions/youtube'

import Grid from 'components/Grid'

import VideoCard from 'components/cards/VideoCard'

interface Props {
  channelId: String
  items: Array<Object>
  nextPageToken: String
  getChannelVideos: Function
  clearChannelVideos: Function
}

interface StateFromProps {
  items: Array<Object>
  nextPageToken: String
}

interface DispatchFromProps {
  getChannelVideos: Function
  clearChannelVideos: Function
}

class Channel extends Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }

  componentWillUnmount() {
    this.props.clearChannelVideos()
  }

  render({
    channelId,
    items,
    nextPageToken: pageToken,
    getChannelVideos
  }: Props) {
    return (
      <Grid
        items={items}
        loadContent={() =>
          pageToken !== null &&
          getChannelVideos({
            channelId,
            pageToken
          })
        }
        ItemComponent={VideoCard}
      />
    )
  }
}

const mapStateToProps = ({ channel: { items, nextPageToken } }) => ({
  items,
  nextPageToken
})

const mapDispatchToProps = (dispatch) => ({
  getChannelVideos: (params) => dispatch(getChannelVideos(params)),
  clearChannelVideos: () => dispatch({ type: 'CLEAR_CHANNEL_ITEMS' })
})

export default connect<StateFromProps, DispatchFromProps, void>(
  mapStateToProps,
  mapDispatchToProps
)(Channel)
