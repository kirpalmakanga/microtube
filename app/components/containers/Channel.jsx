import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getChannelVideos } from '../../api/youtube'

import Grid from '../Grid'

import VideoCard from '../cards/VideoCard'

const Channel = ({ id }) => {
  return (
    <Grid
      loadContent={(pageToken) => getChannelVideos({
        channelId: id,
        pageToken
      })}
      GridItem={VideoCard}
    />
  )
}

export default Channel
