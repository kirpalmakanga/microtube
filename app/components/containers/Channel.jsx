import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import api from '../../api/youtube'

import Grid from '../Grid'

import VideoCard from '../cards/VideoCard'

const Channel = ({ auth, id }) => {
  return (
    <Grid
      loadContent={(pageToken) => api.getChannelVideos({
        accessToken: auth.token,
        channelId: id,
        pageToken
      })}
      GridItem={VideoCard}
    />
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(Channel)
