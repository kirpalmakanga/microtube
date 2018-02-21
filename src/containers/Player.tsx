import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import { throttle, debounce } from 'lodash'

import { preventDefault } from 'lib/helpers'

import formatTime from 'lib/formatTime'

import Helmet from 'preact-helmet'

import Queue from 'components/player/Queue'
import Screen from 'components/player/Screen'

import Button from 'components/player/controls/Button'
import VolumeRange from 'components/player/controls/VolumeRange'
import InfoTime from 'components/player/controls/InfoTime'
import InfoProgress from 'components/player/controls/InfoProgress'

class Player extends Component<any, any> {
    constructor(props: any) {
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
            loadingWatcher: null,
            currentIndex: null,
            currentVideo: {
                title: 'No video.',
                videoId: null
            }
        }
    }

    componentWillReceiveProps({ player }) {
        const activeQueueItem = player.queue.find(({ active }) => active)

        this.setCurrentVideo(activeQueueItem)
    }

    setCurrentVideo({ title = 'No video.', videoId = null } = {}) {
        const { videoId: currentVideoId } = this.state.currentVideo

        if (videoId === null) {
            return this.setState({
                currentTime: 0,
                duration: 0,
                loaded: 0
            })
        }

        this.setState({ currentVideo: { title, videoId } })
    }

    isPlayerReady = () => {
        const { youtube, currentVideo: { videoId } } = this.state

        return !!youtube && videoId
    }

    setVolume = (volume) => {
        if (!this.isPlayerReady()) {
            return
        }

        const { youtube } = this.state

        if (volume > 0) {
            youtube.unMute()
        }

        youtube.setVolume(volume)

        this.setState({ volume }, () => {
            this.props.dispatch({ type: 'SET_VOLUME', data: volume })
        })
    }

    handleWheelVolume = ({ deltaY }) => {
        const { volume } = this.state
        let newVolume, inRange

        if (!this.isPlayerReady()) {
            return
        }

        newVolume = deltaY < 0 ? volume + 5 : volume - 5
        inRange = newVolume >= 0 && newVolume <= 100

        if (inRange) {
            this.setVolume(newVolume)
        }
    }

    setVideoTime = throttle(({ target }) => {
        if (!this.isPlayerReady()) {
            return
        }

        let { duration } = this.state

        let newTime = duration * (target.value / duration)
        this.clearWatchers()
        this.state.youtube.seekTo(newTime)

        this.setState({ currentTime: newTime })
    }, 200)

    watchTime() {
        const { youtube } = this.state
        const duration = youtube.getDuration()

        this.setState({ duration })

        const timeWatcher = setInterval(() => {
            const currentTime = youtube.getCurrentTime()

            this.setState({ currentTime })

            if (currentTime === duration) {
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

            if (loaded === 1) {
                clearInterval(loadingWatcher)
            }
        }, 500)

        this.setState({ loaded: youtube.getVideoLoadedFraction() })

        this.setState({ loadingWatcher })
    }

    toggleMute = () => {
        const { isMuted, youtube } = this.state

        if (!this.isPlayerReady()) {
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

        if (!this.isPlayerReady()) {
            return
        }

        if (isPlaying) {
            return youtube.pauseVideo()
        }

        youtube.playVideo()
    }

    clearWatchers() {
        const { timeWatcher, loadingWatcher } = this.state
        clearInterval(timeWatcher)
        clearInterval(loadingWatcher)
    }

    goToVideo = (next = true) => {
        const { queue } = this.props.player

        const currentIndex = queue.findIndex((v) => v.active) || 0

        const newIndex = currentIndex + (next ? 1 : -1)

        if (newIndex < 0 || newIndex > queue.length - 1) {
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

    render(
        { player, dispatch },
        {
            isPlaying,
            isBuffering,
            isMuted,
            volume,
            loaded,
            currentTime,
            duration,
            currentVideo
        }
    ) {
        const {
            handleWheelVolume,
            setVolume,
            setVideoTime,
            toggleMute,
            togglePlay,
            goToVideo,
            onYoutubeIframeReady,
            onYoutubeIframeStateChange
        } = this

        const { showQueue, showScreen, newQueueItems } = player
        const documentTitle = `Microtube | ${currentVideo.title} - ${formatTime(
            currentTime
        )} / ${formatTime(duration)}`

        return (
            <div class="player__container">
                <Helmet title={documentTitle} />

                <Queue
                    isPlaying={isPlaying}
                    isBuffering={isBuffering}
                    togglePlay={togglePlay}
                />

                <div
                    className={[
                        'screen shadow--2dp',
                        player.showScreen ? 'screen--show' : ''
                    ].join(' ')}
                >
                    <Screen
                        videoId={currentVideo.videoId}
                        onReady={onYoutubeIframeReady}
                        onEnd={goToVideo}
                        onStateChange={onYoutubeIframeStateChange}
                    />
                </div>

                <div class="player shadow--2dp">
                    <div class="player__controls">
                        <Button
                            className="player__controls-button icon-button"
                            onClick={() => goToVideo(false)}
                            icon="icon-skip-previous"
                            ariaLabel="Go to previous video"
                        />

                        <Button
                            className="player__controls-button icon-button"
                            onClick={togglePlay}
                            icon={
                                isBuffering
                                    ? 'icon-loading'
                                    : isPlaying ? 'icon-pause' : 'icon-play'
                            }
                            iconTransitionClass={
                                !isPlaying && isBuffering ? 'rotating' : ''
                            }
                            ariaLabel={isPlaying ? 'Pause video' : 'Play video'}
                        />

                        <Button
                            className="player__controls-button icon-button"
                            onClick={() => goToVideo(true)}
                            icon="icon-skip-next"
                            ariaLabel="Go to next video"
                        />
                    </div>

                    <div class="player__info">
                        <InfoProgress
                            percentElapsed={
                                duration ? currentTime / duration : 0
                            }
                            percentLoaded={loaded}
                        />

                        <div className="player__info-title">
                            {currentVideo.title}
                        </div>

                        <InfoTime
                            currentTime={currentTime}
                            duration={duration}
                        />

                        <label class="sr-only" for="seek-time">
                            Seek time
                        </label>
                        <input
                            id="seek-time"
                            class="player__info-progress-loaded"
                            type="range"
                            min="0"
                            max={parseInt(duration)}
                            onWheel={preventDefault}
                            onChange={setVideoTime}
                        />
                    </div>

                    <div class="player__controls">
                        <Button
                            className={[
                                'player__controls-button badge icon-button',
                                showQueue ? 'is-active' : '',
                                newQueueItems ? 'badge--active' : ''
                            ].join(' ')}
                            onClick={() =>
                                dispatch({
                                    type: showQueue
                                        ? 'QUEUE_CLOSE'
                                        : 'QUEUE_OPEN'
                                })
                            }
                            badge={newQueueItems}
                            icon="icon-list"
                            ariaLabel={showQueue ? 'Close queue' : 'Open queue'}
                        />

                        <Button
                            className={[
                                'player__controls-button icon-button',
                                showScreen ? 'is-active' : ''
                            ].join(' ')}
                            onClick={() =>
                                dispatch({
                                    type: showScreen
                                        ? 'SCREEN_CLOSE'
                                        : 'SCREEN_OPEN'
                                })
                            }
                            icon="icon-film"
                            ariaLabel={
                                showScreen ? 'Close screen' : 'open screen'
                            }
                        />

                        <div
                            class="player__controls-volume"
                            onWheel={handleWheelVolume}
                        >
                            <Button
                                className="player__controls-button icon-button"
                                onClick={toggleMute}
                                icon={
                                    isMuted
                                        ? 'icon-volume-mute'
                                        : volume >= 50
                                          ? 'icon-volume-up'
                                          : volume > 0 && volume <= 50
                                            ? 'icon-volume-down'
                                            : 'icon-volume-off'
                                }
                                ariaLabel={isMuted ? 'Unmute' : 'Mute'}
                            />

                            <VolumeRange
                                value={volume}
                                onChange={({ target }) =>
                                    setVolume(target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Player)
