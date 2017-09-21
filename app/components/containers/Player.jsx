import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import formatTime from '../../lib/formatTime'

import Helmet from 'preact-helmet'

import Queue from '../player/Queue.jsx'
import Screen from '../player/Screen.jsx'

import Button from '../player/controls/Button.jsx'
import VolumeRange from '../player/controls/VolumeRange.jsx'
import InfoTime from '../player/controls/InfoTime.jsx'
import InfoTitle from '../player/controls/InfoTitle.jsx'
import InfoProgress from '../player/controls/InfoProgress.jsx'

class Player extends Component {
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

      this.props.dispatch({ type: 'SET_VOLUME', data: volume })
      youtube.setVolume(volume)
      this.setState({ volume })
  }

  handleWheelVolume = ({ deltaY }) => {
      const { volume } = this.state
      let newVolume, inRange

      if (!this.isIframeReady()) {
        return
      }

      newVolume =  deltaY < 0 ? volume + 5 : volume - 5
      inRange = newVolume >= 0 && newVolume <= 100

      if (inRange) {
        this.setVolume(newVolume)
      }
  }

  setVideoTime = ({ target }) => {
    if(!this.isIframeReady()) {
      return
    }

    let { duration } = this.state

    let newTime = duration * (target.value / duration)
    this.clearWatchers()
    this.state.youtube.seekTo(newTime)

    this.setState({ currentTime: newTime })
  }

  watchTime() {
    const { youtube } = this.state
    const duration = youtube.getDuration()

    this.setState({ duration: duration })

    const timeWatcher = setInterval(() => {
      const currentTime = youtube.getCurrentTime()

      this.setState({ currentTime })

      if(currentTime === duration) {
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

      this.setState({ loaded })

      if (loaded === 1){
        clearInterval(loadingWatcher)
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
    const { volume } = this.props.player

    target.pauseVideo()
    this.setState({ youtube: target }, () => this.setVolume(volume))
  }

  onYoutubeIframeStateChange = ({ data }) => {
    switch (data) {
      case -1:
      case 0:
        this.setState({ isPlaying: false })
      break

      case 1:
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

  render({ player, dispatch }, { isPlaying, isBuffering, isMuted, volume, loaded, currentTime, duration }) {
    const { handleWheelVolume, setVideoTime, togglePlay, goToVideo, onYoutubeIframeReady, onYoutubeIframeStateChange } = this
    const { showQueue, showScreen, newQueueItems } = player
    const [ currentVideo ] = this.getCurrentVideo()
    const documentTitle = ['Microtube', '|', currentVideo.title, '-', formatTime(currentTime), '/', formatTime(duration)].join(' ')

    return (
      <div class='player__container'>
        <Helmet title={documentTitle} />

        <Queue isPlaying={isPlaying} isBuffering={isBuffering} handleClickPlay={togglePlay} />

        <Screen
          video={currentVideo}
          onReady={onYoutubeIframeReady}
          onEnd={goToVideo}
          onStateChange={onYoutubeIframeStateChange}
        />

        <div class='player shadow--2dp'>
          <div class='player__controls'>
            <Button className='player__controls-button icon-button' onClick={() => goToVideo(false)} icon='icon-skip-previous' />

            <Button
              className='player__controls-button icon-button'
              onClick={togglePlay}
              icon={isBuffering ? 'icon-loading' : isPlaying ? 'icon-pause' : 'icon-play' }
              iconTransitionClass={isBuffering ? 'rotating': ''}
            />

            <Button className='player__controls-button icon-button' onClick={() => goToVideo(true)} icon='icon-skip-next' />
          </div>

          <div class='player__info'>
            <InfoProgress percentElapsed={currentTime / duration} percentLoaded={loaded} />

            <InfoTitle title={currentVideo ? currentVideo.title : 'No Video.'} currentTime={currentTime} duration={duration} />

            <InfoTime currentTime={currentTime} duration={duration} />

            <input class='player__info-progress-loaded' type='range' min='0' max={parseInt(duration)} onChange={setVideoTime} />
          </div>

          <div class='player__controls'>
            <Button
              className={[
                'player__controls-button badge icon-button',
                showQueue ? 'is-active' : '',
                newQueueItems ? 'badge--active' : '',
              ].join(' ')}
              onClick={() => dispatch({ type: showQueue ? 'QUEUE_CLOSE' : 'QUEUE_OPEN' })}
              badge={newQueueItems}
              icon='icon-list'
            />

            <Button
              className={['player__controls-button icon-button', showScreen ? 'is-active' : ''].join(' ')}
              onClick={() => dispatch({ type: showScreen ? 'SCREEN_CLOSE' : 'SCREEN_OPEN' })}
              icon='icon-film'
            />

            <div class='player__controls-volume' onWheel={handleWheelVolume}>
              <Button
                className='player__controls-button icon-button'
                icon={
                isMuted ?
                  'icon-volume-mute'
                : volume >= 50 ?
                  'icon-volume-up'
                : volume > 0 && volume <= 50 ?
                  'icon-volume-down'
                :
                  'icon-volume-off'
                }
              />

              <VolumeRange value={volume} onChange={({ target }) => setVolume(target.value)} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Player)
