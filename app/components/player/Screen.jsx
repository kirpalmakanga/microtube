import YoutubePlayer from 'react-youtube'

const { connect } = ReactRedux

const Screen = ({ player, video, onReady, onEnd, onStateChange, dispatch }) => {
  const opts = {
    playerVars: {
      autohide: 1,
      modestbranding: 1,
      iv_load_policy: 3,
      autoplay: true,
      controls: 0,
      showinfo: 0
    }
  }

  return (
    <div className={['screen shadow--2dp', player.showScreen ? 'screen--show': ''].join(' ')}>
          {video ? (
            <YoutubePlayer
              className='screen__content'
              videoId={video.videoId}
              opts={opts}
              onReady={onReady}
              onEnd={onEnd}
              onStateChange={onStateChange}
            />
          ) : null}
    </div>
  )
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Screen)
