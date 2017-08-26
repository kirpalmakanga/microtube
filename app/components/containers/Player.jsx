import Controls from '../player/Controls.jsx'
import Queue from '../player/Queue.jsx'
import Screen from '../player/Screen.jsx'

const { connect } = ReactRedux

class Player extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isPlaying: false,
      isBuffering: false,
      isMuted: false,
      showQueue: false,
      showScreen: false,
      showVolume: false,
      volume: 100,
      loaded: 0,
      currentTime: 0,
      duration: 0,
      youtube: null,
      autoplay: 0,
      timeWatcher: null,
      loadingWatcher: null
    }
  }

  isIframeReady = () => !!this.state.youtube

  setVolume = (volume) => {
      const { youtube } = this.state

      if(!this.isIframeReady()) {
        return
      }

      if(volume > 0) {
        youtube.unMute()
      }

      // this.props.dispatch({ type: 'SET_VOLUME', data: volume })
      youtube.setVolume(volume)
      this.setState({ volume })
  }

  handleWheelVolume = ({ deltaY }) => {
      let newVolume, inRange

      if (!this.isIframeReady()) {
        return
      }

      newVolume =  deltaY < 0 ? volume + 5 : volume - 5
      inRange = newVolume >= 0 && newVolume <= 100

      if(isMuted) {
        this.state.youtube.unMute()
      }

      if (inRange) {
        this.setVolume(newVolume)
      }
  }

  setVideoTime = ({ target }) => {
    let newTime

    if(!this.isIframeReady()) {
      return
    }

    newTime = this.state.duration * (target.value / 100)
    this.state.youtube.seekTo(newTime)

    this.setState({ currentTime: newTime })
  }

  watchTime() {
    const { youtube } = this.state
    const duration = youtube.getDuration()

    this.setState({ duration: duration })

    const timeWatcher = setInterval(() => {
      const currentTime = youtube.getCurrentTime()

      if (currentTime < duration) {
        this.setState({ currentTime })
      } else {
        clearInterval(timeWatcher)
      }
    }, 250)

    this.setState({ currentTime: youtube.getCurrentTime() })

    this.setState({ timeWatcher })
  }

  watchLoading() {
    const { youtube } = this.state

    const loadingWatcher = setInterval(() => {
      const loaded = youtube.getVideoLoadedFraction()

      if (loaded < 1) {
        this.setState({ loaded })
      } else {
        clearInterval(loadingWatcher)
        dispatch({ type: 'UPDATE_LOAD', loaded: 1 })
      }
    }, 500)

    this.setState({ loaded: youtube.getVideoLoadedFraction() })

    this.setState({ loadingWatcher })
  }

  toggleMute = () => {
    const { isMuted } = this.state

    if (!this.isIframeReady()) {
      return
    }

    if (isMuted) {
      youtube.unMute()
    } else {
      youtube.mute()
    }

    this.setState({ isMuted: !isMuted })
  }

  togglePlay = () => {
    const { isPlaying, youtube } = this.state

    if(!this.isIframeReady()) {
      return
    }

    if(isPlaying) {
      return youtube.pauseVideo()
    }

    youtube.playVideo()
  }

  clearWatchers () {
    const { timeWatcher, loadingWatcher } = this.state
    clearInterval(timeWatcher)
    clearInterval(loadingWatcher)
  }

  getCurrentVideo() {
    const { queue } = this.props.player
    const currentIndex = queue.findIndex(item => item.active)
    const video = queue[currentIndex]

    return [video, currentIndex]
  }

  goToVideo = (next = true) => {
    const { queue } = this.props.player

    const [video, index] = this.getCurrentVideo()

    const newIndex = index + (next ? 1 : -1)

    if(!video || newIndex < 0 || newIndex > queue.length - 1) {
      return
    }

    this.clearWatchers()

    this.setState({
      currentTime: 0,
      loaded: 0
    })

    this.props.dispatch({
      type: 'QUEUE_SET_ACTIVE_ITEM',
      data: { index: newIndex }
    })
  }

  onYoutubeIframeReady = ({ target }) => {
    target.pauseVideo()
    // dispatch({ type: 'ENABLE_AUTOPLAY' })
    this.setState({ youtube: target })
    this.setVolume(target.getVolume())
  }

  onYoutubeIframeStateChange = ({ data }) => {
    switch (data) {
      case -1:
      case 0:
        this.setState({ isPlaying: false })
      break

      case 1:
        this.state.youtube.setVolume(this.props.player.volume)
        this.setState({ isPlaying: true, isBuffering: false }, () => {
          this.watchTime()
          this.watchLoading()
        })
      break

      case 2:
        this.clearWatchers()
        this.setState({ isPlaying: false })
      break

      case 3:
        this.clearWatchers()
        this.setState({ isBuffering: true })
      break

      case 5:
        this.togglePlay()
      break
    }
  }

  render() {
    const { isPlaying, isBuffering, isMuted, volume, loaded, currentTime, duration } = this.state
    const [currentVideo] = this.getCurrentVideo()

    return (
      <div className='player__container'>
        <Queue isPlaying={isPlaying} isBuffering={isBuffering} handleClickPlay={this.togglePlay} />

        <Screen
          video={currentVideo}
          onReady={this.onYoutubeIframeReady}
          onEnd={this.goToVideo}
          onStateChange={this.onYoutubeIframeStateChange}
        />

        <Controls
          info={{
            isPlaying,
            isBuffering,
            isMuted,
            volume,
            loaded,
            currentTime,
            duration,
            currentVideo
          }}
          togglePlay={this.togglePlay}
          toggleMute={this.toggleMute}
          goToVideo={this.goToVideo}
          setVolume={this.setVolume}
          handleWheelVolume={this.handleWheelVolume}
          setVideoTime={this.setVideoTime}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Player)
