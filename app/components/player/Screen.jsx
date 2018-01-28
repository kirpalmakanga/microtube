import { h, Component } from 'preact'

import YoutubePlayer from '../YoutubePlayer'

const playerOptions = {
  playerVars: {
    autohide: 1,
    modestbranding: 1,
    iv_load_policy: 3,
    autoplay: true,
    controls: 0,
    showinfo: 0
  }
}

const Screen = ({ videoId, onReady, onEnd, onStateChange }) => (
  <YoutubePlayer
    className='screen__content'
    videoId={videoId}
    opts={playerOptions}
    onReady={onReady}
    onEnd={onEnd}
    onStateChange={onStateChange}
  />
)

export default Screen
