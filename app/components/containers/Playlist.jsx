import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import api from '../../api/youtube'

import Grid from '../Grid'

import VideoCard from '../cards/VideoCard'

const Playlist = ({ auth, id }) => {
  return (
    <Grid
      loadContent={(pageToken) => api.getPlaylistItems({
        accessToken: auth.token,
        playlistId: id,
        pageToken
      })}
      GridItem={VideoCard}
    />
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(Playlist)
