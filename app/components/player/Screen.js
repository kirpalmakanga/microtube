// jshint esversion: 6, asi: true
// eslint-env es6



import YoutubePlayer from 'react-youtube'
const { connect } = ReactRedux

function getTimeWatcher(yt, dispatch) {
  const duration = yt.getDuration()
  const interval = setInterval(() => {
    const playerState = yt.getPlayerState()
    const currentTime = yt.getCurrentTime()

    if (currentTime < duration && playerState === 1) {
      dispatch({
        type: 'UPDATE_TIME',
        currentTime
      })
    } else {
      clearInterval(interval)
    }
  }, 250)

  dispatch({
    type: 'UPDATE_TIME',
    currentTime: yt.getCurrentTime(),
    duration
  })

  return interval
}

function getLoadingWatcher(yt, dispatch) {
  const interval = setInterval(() => {
    const playerState = yt.getPlayerState()
    const loaded = yt.getVideoLoadedFraction()

    if (loaded < 1) {
      dispatch({
        type: 'UPDATE_LOAD',
        loaded
      })
    } else {
      clearInterval(interval)
      dispatch({
        type: 'UPDATE_LOAD',
        loaded: 1
      })
    }
  }, 500)

  dispatch({
    type: 'UPDATE_LOAD',
    loaded: yt.getVideoLoadedFraction()
  })

  return interval
}

const Screen = ({ player, dispatch }) => {
  const opts = {
    playerVars: {
      autohide: 1,
      modestbranding: 1,
      iv_load_policy: 3,
      autoplay: 1,
      controls: 0,
      showinfo: 0
    }
  }

  const videoId = player.video.videoId

  const currentIndex = player.queue.reduce((result, item, i) => {
    if (videoId === item.videoId) {
      return i
    }
    return result
  }, 0)

  const nextVideo = player.queue[currentIndex + 1]

  return (
    <div className={['screen mdl-shadow--2dp', player.showScreen ? 'screen--show': ''].join(' ')}>
          {videoId ? (
            <YoutubePlayer
              className={'screen__content'}
              videoId={videoId}
              opts={opts}
              onReady={({ target }) => {
                dispatch({
                  type: 'GET_YOUTUBE',
                  youtube: target
                })
                dispatch({
                  type: 'SET_VOLUME',
                  data: target.getVolume()
                })
              }}
              onEnd={() => {
                if (nextVideo) {
                  dispatch({
                    type: 'PLAY',
                    data: nextVideo,
                    skip: true
                  })
                }
              }}
              onStateChange={({data, target}) => {
                const playerState = data.toString()

                const actions = new Map([
                  ['-1', () => {
                    dispatch({ type: 'PAUSE' })
                  }],
                  ['0', () => {
                    dispatch({ type: 'PAUSE' })
                  }],
                  ['1', () => {
                    target.setVolume(player.volume)

                    dispatch({
                      type: 'SET_WATCHERS',
                      time: getTimeWatcher(target, dispatch),
                      loading: getLoadingWatcher(target, dispatch)
                    })

                    dispatch({ type: 'PLAY' })
                  }],
                  ['2', () => {
                    dispatch({ type: 'CLEAR_WATCHERS' })
                    dispatch({ type: 'PAUSE' })
                  }],
                  ['3', () => {
                    dispatch({ type: 'CLEAR_WATCHERS' })
                    dispatch({ type: 'BUFFER' })
                  }],
                  ['5', () => dispatch({ type: '' })]
                ])

                let action = actions.get(playerState)

                if (action && typeof action === 'function') {
                  action()
                } else {
                  console.error('onStateChange callback must be a function')
                }
              }}
            />
          ) : null}
    </div>
  )
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Screen)
