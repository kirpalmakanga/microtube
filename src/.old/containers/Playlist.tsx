import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getPlaylistItems } from 'actions/youtube'

import Grid from 'components/Grid'

import VideoCard from 'components/cards/VideoCard'

interface Props {
  playlistId: String
  items: Array<Object>
  nextPageToken: String
  getPlaylistItems: Function
  clearPlaylistItems: Function
}

interface StateFromProps {
  items: Array<Object>
  nextPageToken: String
}

interface DispatchFromProps {
  getPlaylistItems: Function
  clearPlaylistItems: Function
}

class Playlist extends Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }

  componentWillUnmount() {
    this.props.clearPlaylistItems()
  }

  render({ playlistId, items, nextPageToken, getPlaylistItems }: Props) {
    return (
      <Grid
        items={items}
        loadContent={() =>
          nextPageToken !== null &&
          getPlaylistItems({
            playlistId,
            pageToken: nextPageToken
          })
        }
        ItemComponent={VideoCard}
      />
    )
  }
}

const mapStateToProps = ({ playlistItems: { items, nextPageToken } }) => ({
  items,
  nextPageToken
})

const mapDispatchToProps = (dispatch) => ({
  getPlaylistItems: (params) => dispatch(getPlaylistItems(params)),
  clearPlaylistItems: () => dispatch({ type: 'CLEAR_PLAYLIST_ITEMS' })
})

export default connect<StateFromProps, DispatchFromProps, void>(
  mapStateToProps,
  mapDispatchToProps
)(Playlist)
