import { h } from 'preact'
import { connect } from 'preact-redux'

import YoutubePlayer from '../YoutubePlayer.jsx'

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

const Screen = ({ player, video, onReady, onEnd, onStateChange, dispatch }) => (
  <div className={['screen shadow--2dp', player.showScreen ? 'screen--show': ''].join(' ')}>
      {video ? (
        <YoutubePlayer
          className='screen__content'
          videoId={video.videoId}
          opts={playerOptions}
          onReady={onReady}
          onEnd={onEnd}
          onStateChange={onStateChange}
        />
      ) : null}
  </div>
)

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Screen)
