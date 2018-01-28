import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getPlaylistItems } from 'actions/youtube'

import Grid from 'components/Grid'

import VideoCard from 'components/cards/VideoCard'

class Playlist extends Component {
  componentWillUnmount() {
    this.props.dispatch({ type: 'CLEAR_PLAYLIST_ITEMS' })
  }

  render({ id, playlistItems, dispatch }) {
    const { items, nextPageToken } = playlistItems

    return (
      <Grid
        items={items}
        loadContent={() => nextPageToken !== null && dispatch(
          getPlaylistItems({
            playlistId: id,
            pageToken: nextPageToken
          })
        )}
        ItemComponent={VideoCard}
      />
    )
  }
}

const mapStateToProps = ({ playlistItems }) => ({ playlistItems })

export default connect(mapStateToProps)(Playlist)
