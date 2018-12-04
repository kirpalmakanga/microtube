import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';

import { Helmet } from 'react-helmet';

import { isMobile } from '../../lib/helpers';

import {
    enableFullScreen,
    exitFullScreen,
    listenFullScreenChange
} from '../../lib/fullscreen';

import { formatTime } from '../../lib/helpers';

import Queue from './Queue';
import Screen from './Screen';

import Button from './controls/Button';
import VolumeRange from './controls/VolumeRange';

import Info from './Info';

class Player extends Component {
    constructor(props) {
        super(props);

        const currentVideo = props.player.queue.find(
            ({ active }) => active
        ) || {
            title: 'No video.',
            videoId: null,
            duration: 0
        };

        this.state = {
            isPlaying: false,
            isBuffering: false,
            isMuted: false,
            isFullScreen: false,
            showQueue: false,
            showScreen: false,
            showVolume: false,
            volume: 100,
            loaded: 0,
            currentTime: 0,
            youtube: null,
            autoplay: 0,
            timeWatcher: null,
            loadingWatcher: null,
            currentIndex: null,
            currentVideo
        };
    }

    componentDidUpdate() {
        this.setCurrentVideo();
    }

    getPlayerContainer = (el) => (this._container = el);

    setCurrentVideo() {
        const {
            currentVideo: { videoId: currentVideoId }
        } = this.state;
        const {
            player: { queue }
        } = this.props;

        const { title = 'No video.', id: videoId = null, duration = 0 } =
            queue.find(({ active }) => active) || {};

        videoId !== currentVideoId &&
            this.setState({
                currentVideo: { title, videoId, duration },
                ...(videoId === null
                    ? {
                          currentTime: 0,
                          loaded: 0
                      }
                    : {})
            });
    }

    isPlayerReady = () => {
        const {
            youtube,
            currentVideo: { videoId }
        } = this.state;

        return !!youtube && videoId;
    };

    updateTime = (t) => {
        const currentTime = t || this.state.youtube.getCurrentTime();

        this.setState({
            currentTime
        });

        this.props.saveCurrentTime(currentTime);
    };

    setVolume = (volume) => {
        if (!this.isPlayerReady()) {
            return;
        }

        const { youtube } = this.state;

        if (volume > 0) {
            youtube.unMute();
        }

        const { saveVolume } = this.props;

        youtube.setVolume(volume);

        this.setState({ volume }, () => saveVolume(volume));
    };

    handleWheelVolume = ({ deltaY }) => {
        const { volume } = this.state;
        let newVolume, inRange;

        if (!this.isPlayerReady()) {
            return;
        }

        newVolume = deltaY < 0 ? volume + 5 : volume - 5;
        inRange = newVolume >= 0 && newVolume <= 100;

        if (inRange) {
            this.setVolume(newVolume);
        }
    };

    seekTime = throttle((value) => {
        if (!this.isPlayerReady()) {
            return;
        }

        let {
            currentVideo: { duration },
            youtube
        } = this.state;

        let t = duration * (value / duration);

        this.clearWatchers();

        youtube.seekTo(t);

        this.updateTime(t);
    }, 200);

    watchTime() {
        const { youtube } = this.state;

        this.updateTime();

        const timeWatcher = setInterval(() => {
            this.updateTime();

            if (youtube.getCurrentTime() === youtube.getDuration()) {
                clearInterval(timeWatcher);
            }
        }, 250);

        this.timeWatcher = timeWatcher;
    }

    watchLoading() {
        const loadingWatcher = setInterval(async () => {
            const loaded = await this.updateLoading();

            if (loaded === 1) {
                clearInterval(loadingWatcher);
            }
        }, 500);

        this.updateLoading();

        this.loadingWatcher = loadingWatcher;
    }

    updateLoading = () =>
        new Promise((resolve) => {
            const { youtube } = this.state;

            const loaded = youtube.getVideoLoadedFraction();

            this.setState({ loaded }, () => resolve(loaded));
        });

    toggleMute = () => {
        const { isMuted, youtube } = this.state;

        if (!this.isPlayerReady()) {
            return;
        }

        if (isMuted) {
            youtube.unMute();
        } else {
            youtube.mute();
        }

        this.setState({ isMuted: !isMuted });
    };

    togglePlay = () => {
        const { isPlaying, youtube } = this.state;

        if (!this.isPlayerReady()) {
            return;
        }

        if (isPlaying) {
            return youtube.pauseVideo();
        }

        youtube.playVideo();
    };

    clearWatchers() {
        const { timeWatcher, loadingWatcher } = this;
        clearInterval(timeWatcher);
        clearInterval(loadingWatcher);
    }

    goToVideo = (next = true) => {
        const {
            player: { queue },
            setActiveQueueItem
        } = this.props;

        const currentIndex = queue.findIndex((v) => v.active) || 0;

        const newIndex = currentIndex + (next ? 1 : -1);

        if (newIndex < 0 || newIndex > queue.length - 1) {
            return;
        }

        this.clearWatchers();

        this.setState({
            currentTime: 0,
            loaded: 0
        });

        setActiveQueueItem(newIndex);
    };

    onYoutubeIframeReady = ({ target: youtube }) => {
        const { volume, currentTime } = this.props.player;

        youtube.pauseVideo();

        this.setState({ youtube }, () => {
            if (currentTime) {
                youtube.seekTo(currentTime);

                this.updateTime();
            }

            this.setVolume(volume);
        });
    };

    onYoutubeIframeStateChange = ({ data }) => {
        switch (data) {
            case -1:
            case 0:
                this.setState({ isPlaying: false });
                break;

            case 1:
                this.setState({ isPlaying: true, isBuffering: false }, () => {
                    this.watchTime();
                    this.watchLoading();
                });
                break;

            case 2:
                this.clearWatchers();
                this.setState({ isPlaying: false });
                break;

            case 3:
                this.clearWatchers();
                this.setState({ isBuffering: true });
                break;

            case 5:
                this.togglePlay();
                break;
        }
    };

    handleFullScreenChange = (isFullScreen) => this.setState({ isFullScreen });

    toggleFullScreen = () => {
        const {
            state: { isFullScreen },
            _container
        } = this;

        if (!isFullScreen) {
            return enableFullScreen(_container);
        }
        exitFullScreen();
    };

    componentDidMount() {
        listenFullScreenChange(this._container, this.handleFullScreenChange);
    }

    render() {
        const {
            props: { player, toggleQueue, toggleScreen },
            state: {
                isPlaying,
                isBuffering,
                isMuted,
                isFullScreen,
                volume,
                currentVideo: { videoId, title, duration },
                loaded,
                currentTime
            },
            getPlayerContainer,
            handleWheelVolume,
            setVolume,
            seekTime,
            toggleFullScreen,
            toggleMute,
            togglePlay,
            goToVideo,
            onYoutubeIframeReady,
            onYoutubeIframeStateChange
        } = this;

        const { showQueue, showScreen, newQueueItems } = player;

        return (
            <div
                className={[
                    'player__container',
                    isFullScreen ? 'is-fullscreen' : ''
                ].join(' ')}
                ref={getPlayerContainer}
            >
                {title ? (
                    <Helmet
                        title={
                            title
                                ? `Microtube | ${title} - ${formatTime(
                                      currentTime
                                  )} / ${formatTime(duration)}`
                                : ''
                        }
                    />
                ) : null}

                <Queue
                    isPlaying={isPlaying}
                    isBuffering={isBuffering}
                    togglePlay={togglePlay}
                />

                <Screen
                    className={[
                        'screen shadow--2dp',
                        player.showScreen || isFullScreen ? 'screen--show' : ''
                    ].join(' ')}
                    videoId={videoId}
                    onReady={onYoutubeIframeReady}
                    onEnd={goToVideo}
                    onStateChange={onYoutubeIframeStateChange}
                />

                <div
                    className={[
                        'player',
                        !isFullScreen ? 'shadow--2dp' : ''
                    ].join(' ')}
                >
                    <div className="player__inner">
                        <div className="player__controls">
                            <Button
                                className="player__controls-button icon-button"
                                onClick={() => goToVideo(false)}
                                icon="skip-previous"
                                ariaLabel="Go to previous video"
                            />

                            <Button
                                className="player__controls-button icon-button"
                                onClick={togglePlay}
                                icon={
                                    isBuffering
                                        ? 'loading'
                                        : isPlaying
                                        ? 'pause'
                                        : 'play'
                                }
                                iconTransitionClass={
                                    isBuffering ? 'rotating' : ''
                                }
                                ariaLabel={
                                    isPlaying ? 'Pause video' : 'Play video'
                                }
                            />

                            <Button
                                className="player__controls-button icon-button"
                                onClick={() => goToVideo(true)}
                                icon="skip-next"
                                ariaLabel="Go to next video"
                            />

                            {!isMobile ? (
                                <div
                                    className="player__controls-volume"
                                    onWheel={handleWheelVolume}
                                >
                                    <Button
                                        className="player__controls-button icon-button"
                                        onClick={toggleMute}
                                        icon={
                                            isMuted
                                                ? 'volume-mute'
                                                : volume >= 50
                                                ? 'volume-up'
                                                : volume > 0 && volume <= 50
                                                ? 'volume-down'
                                                : 'volume-off'
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
                            ) : null}
                        </div>
                        <Info
                            {...{
                                title,
                                currentTime,
                                duration,
                                loaded,
                                seekTime
                            }}
                        />
                        <div className="player__controls">
                            <Button
                                className={[
                                    'player__controls-button badge icon-button',
                                    showQueue ? 'is-active' : '',
                                    newQueueItems && !showQueue
                                        ? 'badge--active'
                                        : ''
                                ].join(' ')}
                                onClick={() => toggleQueue(showQueue)}
                                badge={newQueueItems}
                                icon="list"
                                ariaLabel={
                                    showQueue ? 'Close queue' : 'Open queue'
                                }
                            />

                            {!isFullScreen ? (
                                <Button
                                    className={[
                                        'player__controls-button icon-button',
                                        showScreen ? 'is-active' : ''
                                    ].join(' ')}
                                    onClick={() => toggleScreen(showScreen)}
                                    icon="film"
                                    ariaLabel={
                                        showScreen
                                            ? 'Close screen'
                                            : 'open screen'
                                    }
                                />
                            ) : null}

                            <Button
                                className="player__controls-button icon-button"
                                onClick={toggleFullScreen}
                                icon={
                                    isFullScreen
                                        ? 'fullscreen-exit'
                                        : 'fullscreen'
                                }
                                ariaLabel={
                                    showScreen
                                        ? 'Enable Fullscreen'
                                        : 'Exit Fullscreen'
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ player }) => ({ player });

const mapDispatchToProps = (dispatch) => ({
    setActiveQueueItem: (index) =>
        dispatch({
            type: 'QUEUE_SET_ACTIVE_ITEM',
            data: { index }
        }),

    saveVolume: (volume) => dispatch({ type: 'SET_VOLUME', data: volume }),

    saveCurrentTime: (t) => dispatch({ type: 'SET_CURRENT_TIME', data: t }),

    toggleQueue: (showQueue) =>
        dispatch({
            type: showQueue ? 'QUEUE_CLOSE' : 'QUEUE_OPEN'
        }),

    toggleScreen: (showScreen) =>
        dispatch({
            type: showScreen ? 'SCREEN_CLOSE' : 'SCREEN_OPEN'
        })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);
