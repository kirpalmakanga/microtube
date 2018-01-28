import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getPlaylists } from 'actions/youtube'

import Grid from 'components/Grid'

import PlaylistCard from 'components/cards/PlaylistCard'

class Playlists extends Component {
  componentDidMount() {
      this.forceUpdate()
  }

  render({ playlists, dispatch }) {
    const { items, nextPageToken } = playlists

    return (
      <Grid
        items={items}
        loadContent={() => nextPageToken !== null && dispatch(
          getPlaylists({
            mine: true,
            pageToken: nextPageToken
          })
        )}
        ItemComponent={PlaylistCard}
      />
    )
  }
}

const mapStateToProps = ({ playlists }) => ({ playlists })

export default connect(mapStateToProps)(Playlists)
