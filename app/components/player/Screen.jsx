import YoutubePlayer from 'react-youtube'
import Notification from 'react-web-notification'

import getThumbnails from '../../lib/getThumbnails'
import { setActiveQueueItem } from '../../actions/player'

const { connect } = ReactRedux

function getTimeWatcher(yt, dispatch) {
  const duration = yt.getDuration()
  const interval = setInterval(() => {
    const playerState = yt.getPlayerState()
    const currentTime = yt.getCurrentTime()

    if (currentTime < duration && playerState === 1) {
      dispatch({ type: 'UPDATE_TIME', data: { currentTime, duration } })
    } else {
      clearInterval(interval)
    }
  }, 250)

  dispatch({
    type: 'UPDATE_TIME',
    data: { currentTime: yt.getCurrentTime(), duration }
  })

  return interval
}

function getLoadingWatcher(yt, dispatch) {
  const interval = setInterval(() => {
    const playerState = yt.getPlayerState()
    const loaded = yt.getVideoLoadedFraction()

    if (loaded < 1) {
      dispatch({ type: 'UPDATE_LOAD', data: loaded })
    } else {
      clearInterval(interval)
      dispatch({ type: 'UPDATE_LOAD', loaded: 1 })
    }
  }, 500)

  dispatch({ type: 'UPDATE_LOAD', data: yt.getVideoLoadedFraction() })

  return interval
}

const Screen = ({ player, dispatch }) => {
  const opts = {
    playerVars: {
      autohide: 1,
      modestbranding: 1,
      iv_load_policy: 3,
      autoplay: player.autoplay,
      controls: 0,
      showinfo: 0
    }
  }

  const currentIndex = player.queue.findIndex(item => item.active)
  const video = player.queue[currentIndex]

  const notificationProps = {
    title: video.title,
    options: {
      image: getThumbnails(video.thumbnails),
      body: video.channelTitle
    }
  }

  function goToNext() {
    const index = currentIndex + 1
    const video = player.queue[index]

    if(video) {
      dispatch({ type: 'CLEAR_WATCHERS' })
      dispatch({ type: 'RESET_TIME' })

      dispatch(setActiveQueueItem({ queue: player.queue, index }))
    }
  }

  return (
    <div className={['screen shadow--2dp', player.showScreen ? 'screen--show': ''].join(' ')}>
          {video ? (
            <YoutubePlayer
              className='screen__content'
              videoId={video.videoId}
              opts={opts}
              onReady={({ target }) => {
                target.pauseVideo()
                dispatch({ type: 'ENABLE_AUTOPLAY' })
                dispatch({ type: 'GET_YOUTUBE', data: target })
                dispatch({ type: 'SET_VOLUME', data: target.getVolume() })
              }}
              onEnd={goToNext}
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
                      data: {
                        time: getTimeWatcher(target, dispatch),
                        loading: getLoadingWatcher(target, dispatch)
                      }
                    })

                    dispatch({ type: 'PLAY', data: player.video })
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
                }
              }}
            />
          ) : null}
          {player.notify ? (<Notification title={video.title} />) : null}
    </div>
  )
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Screen)
