import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getPlaylists } from '../../api/youtube'

import Grid from '../Grid'

import PlaylistCard from '../cards/PlaylistCard'

const Playlists = () => {
  return (
    <Grid
      loadContent={(pageToken) => getPlaylists({
        mine: true,
        pageToken
      })}
      GridItem={PlaylistCard}
    />
  )
}

export default Playlists
