import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import api from '../../api/youtube'

import Grid from '../Grid'

import PlaylistCard from '../cards/PlaylistCard'

const Playlists = ({ auth }) => {
  return (
    <Grid
      loadContent={(pageToken) => api.getPlaylists({
        accessToken: auth.token,
        pageToken
      })}
      GridItem={PlaylistCard}
    />
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(Playlists)
