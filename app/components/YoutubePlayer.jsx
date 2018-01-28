import { h, Component } from 'preact'

import isEqual from 'lodash/isEqual'
import youTubePlayer from 'youtube-player'

const noop = () => {}

function filterResetOptions(opts) {
  return {
    ...opts,
    playerVars: {
      ...opts.playerVars,
      autoplay: 0,
      start: 0,
      end: 0,
    },
  }
}

function shouldUpdateVideo(prevProps, props) {
  if (prevProps.videoId !== props.videoId) {
    return true
  }

  const prevVars = prevProps.opts.playerVars || {}
  const vars = props.opts.playerVars || {}

  return prevVars.start !== vars.start || prevVars.end !== vars.end
}

function shouldResetPlayer(prevProps, props) {
  return !isEqual(
    filterResetOptions(prevProps.opts),
    filterResetOptions(props.opts)
  )
}

function shouldUpdatePlayer(prevProps, props) {
  return (
     prevProps.id === props.id || prevProps.className === props.className
  )
}

class YouTube extends Component {

  static defaultProps = {
    opts: {},
    onReady: noop,
    onError: noop,
    onPlay: noop,
    onPause: noop,
    onEnd: noop,
    onStateChange: noop,
    onPlaybackRateChange: noop,
    onPlaybackQualityChange: noop
  }

  static PlayerState = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  }

  constructor(props) {
    super(props)

    this.container = null
    this.internalPlayer = null
  }

  componentDidMount = () => this.createPlayer()

  componentDidUpdate(prevProps) {
    if (shouldUpdatePlayer(prevProps, this.props)) {
      this.updatePlayer()
    }

    if (shouldResetPlayer(prevProps, this.props)) {
      this.resetPlayer()
    }

    if (shouldUpdateVideo(prevProps, this.props)) {
      this.updateVideo()
    }
  }

  componentWillUnmount = () => this.internalPlayer.destroy()

  createPlayer = () => {
    if (typeof document === 'undefined') {
      return
    }

    this.internalPlayer = youTubePlayer(this.container, {
      ...this.props.opts,
      videoId: this.props.videoId,
    })

    this.internalPlayer.on('ready', this.props.onReady)
    this.internalPlayer.on('error', this.props.onError)
    this.internalPlayer.on('stateChange', (e) => {
      this.props.onStateChange(e)
      switch (e.data) {

        case YouTube.PlayerState.ENDED:
          this.props.onEnd(e)
          break

        case YouTube.PlayerState.PLAYING:
          this.props.onPlay(e)
          break

        case YouTube.PlayerState.PAUSED:
          this.props.onPause(e)
          break

        default:
          return
      }
    })
    this.internalPlayer.on('playbackRateChange', this.props.onPlaybackRateChange)
    this.internalPlayer.on('playbackQualityChange', this.props.onPlaybackQualityChange)
  }

  resetPlayer = () => this.internalPlayer.destroy().then(this.createPlayer)

  updatePlayer = () => {
    this.internalPlayer.getIframe().then((iframe) => {
      iframe.setAttribute('id', this.props.id)
      iframe.setAttribute('class', this.props.className)
    })
  }

  updateVideo = () => {
    const { videoId, opts } = this.props
    const newOpts = { videoId }
    let autoplay = false

    if (typeof videoId === 'undefined' || videoId === null) {
      this.internalPlayer.stopVideo()
      return
    }

    if ('playerVars' in opts) {
      autoplay = opts.playerVars.autoplay === 1
      if ('start' in opts.playerVars) {
        newOpts.startSeconds = opts.playerVars.start
      }
      if ('end' in opts.playerVars) {
        newOpts.endSeconds = opts.playerVars.end
      }
    }

    if (autoplay) {
      this.internalPlayer.loadVideoById(newOpts)
      return
    }

    this.internalPlayer.cueVideoById(newOpts)
  }

  render = () => (
    <span>
      <div id={this.props.id} className={this.props.className} ref={(el) => this.container = el} ></div>
    </span>
  )
}

export default YouTube
