import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getPlaylistItems } from '../../api/youtube'

import Grid from '../Grid'

import VideoCard from '../cards/VideoCard'

const Playlist = ({ id }) => {
  return (
    <Grid
      loadContent={(pageToken) => getPlaylistItems({
        playlistId: id,
        pageToken
      })}
      GridItem={VideoCard}
    />
  )
}

export default Playlist
