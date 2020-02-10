import { Component } from 'react';
import { connect } from 'react-redux';

import { listen, publish } from '../../api/socket';

import { setActiveDevice } from '../../actions/app';

import {
    setActiveQueueItem,
    toggleQueue,
    toggleScreen
} from '../../actions/youtube';

import { isMobile, omit } from '../../lib/helpers';

import {
    enableFullScreen,
    exitFullScreen,
    listenFullScreenChange
} from '../../lib/fullscreen';

import Queue from './Queue';
import Screen from './Screen';

import Button from './controls/Button';
import VolumeRange from './controls/VolumeRange';

import Info from './Info';

const PLAYING = 1;
const UNSTARTED = -1;
const ENDED = 0;
const PAUSED = 2;
const BUFFERING = 3;
const CUED = 5;

class Player extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: false,
            isBuffering: false,
            isMuted: false,
            isFullScreen: false,
            showVolume: false,
            showDevices: false,
            volume: 100,
            loaded: 0,
            currentTime: 0,
            youtube: null
        };
    }

    updateState = (data) => {
        this.setState(data);

        const {
            currentDevice: { isMaster }
        } = this.props;

        if (isMaster) {
            publish('player:sync', data);
        }
    };

    getPlayerContainer = (el) => (this._container = el);

    getCurrentVideo = () => {
        const {
            props: { queue, video, currentIndex }
        } = this;

        if (video.id) {
            return video;
        }

        return (
            queue[currentIndex] || {
                title: 'No video.',
                id: '',
                duration: 0
            }
        );
    };

    isPlayerReady = () => {
        const {
            state: { youtube },
            props: {
                queue,
                video: { id },
                currentIndex
            }
        } = this;

        return !!youtube && (id || queue[currentIndex]);
    };

    updateTime = (t) => {
        const {
            state: { youtube },
            updateState
        } = this;

        const currentTime = t || youtube.getCurrentTime();

        updateState({ currentTime });
    };

    setVolume = (volume) => {
        if (!this.isPlayerReady()) {
            return;
        }

        const {
            state: { youtube },
            updateState
        } = this;

        if (volume > 0) {
            youtube.unMute();
        }
        youtube.setVolume(volume);

        updateState({ volume });
    };

    handleWheelVolume = ({ deltaY }) => {
        if (!this.isPlayerReady()) {
            return;
        }

        const { volume } = this.state;
        const newVolume = deltaY < 0 ? volume + 5 : volume - 5;
        const inRange = newVolume >= 0 && newVolume <= 100;

        if (inRange) {
            this.setVolume(newVolume);
        }
    };

    seekTime = (value) => {
        if (!this.isPlayerReady()) {
            return;
        }

        const {
            state: { isPlaying, youtube },
            getCurrentVideo,
            clearWatchers,
            updateTime,
            togglePlay
        } = this;

        const { duration } = getCurrentVideo();

        const t = duration * (value / duration);

        clearWatchers();

        youtube.seekTo(t);

        updateTime(t);

        setTimeout(() => {
            if (!isPlaying) {
                togglePlay();
            }
        });
    };

    watchTime = () => {
        const { youtube } = this.state;

        this.updateTime();

        this.timeWatcher = setInterval(() => {
            this.updateTime();

            if (youtube.getCurrentTime() === youtube.getDuration()) {
                clearInterval(this.timeWatcher);
            }
        }, 250);
    };

    watchLoading = () => {
        this.updateLoading();

        this.loadingWatcher = setInterval(() => {
            const loaded = this.updateLoading();

            if (loaded === 1) {
                clearInterval(this.loadingWatcher);
            }
        }, 500);
    };

    updateLoading = () => {
        const {
            state: { youtube },
            updateState
        } = this;

        const loaded = youtube.getVideoLoadedFraction();

        updateState({ loaded });

        return loaded;
    };

    toggleMute = () => {
        const {
            state: { isMuted, youtube },
            updateState
        } = this;

        if (!this.isPlayerReady()) {
            return;
        }

        if (isMuted) {
            youtube.unMute();
        } else {
            youtube.mute();
        }

        updateState({ isMuted: !isMuted });
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

    toggleDevices = () => {
        const { showDevices } = this.state;

        this.setState({ showDevices: !showDevices });
    };

    clearWatchers = () => {
        const { timeWatcher, loadingWatcher } = this;

        clearInterval(timeWatcher);
        clearInterval(loadingWatcher);
    };

    goToVideo = (next = true) => {
        const {
            props: { queue, video, currentIndex, setActiveQueueItem },
            updateState
        } = this;

        if (!!video.id) {
            return;
        }

        const newIndex = currentIndex + (next ? 1 : -1);

        if (!queue[newIndex]) {
            return;
        }

        this.clearWatchers();

        updateState({
            currentTime: 0,
            loaded: 0
        });

        setActiveQueueItem(newIndex);
    };

    setPlaybackQuality = (value = 'hd1080') => {
        const { youtube } = this.state;

        youtube.setPlaybackQuality(value);
    };

    onYoutubeIframeReady = ({ target: youtube }) => {
        youtube.pauseVideo();

        this.setState({ youtube }, () => {
            const { volume, currentTime } = this.props;

            if (currentTime) {
                youtube.seekTo(currentTime);

                this.updateTime();
            }

            this.setPlaybackQuality();

            this.setVolume(volume);
        });
    };

    onYoutubeIframeStateChange = ({ data }) => {
        const { updateState } = this;
        switch (data) {
            case UNSTARTED:
            case ENDED:
                updateState({ isPlaying: false });
                break;

            case PLAYING:
                updateState({ isPlaying: true, isBuffering: false });

                this.watchTime();
                this.watchLoading();
                break;

            case PAUSED:
                this.clearWatchers();

                updateState({ isPlaying: false });
                break;

            case BUFFERING:
                const { isPlaying, currentTime } = this.state;

                this.clearWatchers();

                if (isPlaying && currentTime > 0) {
                    updateState({ isBuffering: true });
                }

                this.setPlaybackQuality();
                break;

            case CUED:
                this.togglePlay();
                break;
        }
    };

    bindKeyboard = () => {
        if (this.__keyboardHandler) {
            return;
        }

        const callbacks = {
            ArrowLeft: () => this.goToVideo(false),

            ArrowRight: () => this.goToVideo(true),

            f: this.toggleFullScreen,

            m: this.toggleMute,

            q: this.props.toggleQueue,

            s: this.props.toggleScreen,

            ' ': this.togglePlay
        };

        this.__keyboardHandler = ({ key, repeat }) =>
            !repeat && typeof callbacks[key] === 'function' && callbacks[key]();

        document.addEventListener('keydown', this.__keyboardHandler);
    };

    unbindKeyboard = () => {
        document.removeEventListener('keydown', this.__keyboardHandler);

        this.__keyboardHandler = null;
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

        listen('player:sync', (data) => this.setState(data));

        this.bindKeyboard();
    }

    componentWillUnmount() {
        this.unbindKeyboard();
    }

    render() {
        const {
            props: {
                devices,
                currentDevice,
                setActiveDevice,
                video,
                showQueue,
                showScreen,
                newQueueItems,
                toggleQueue,
                toggleScreen
            },
            state: {
                currentTime,
                loaded,
                volume,
                isPlaying,
                isBuffering,
                isMuted,
                isFullScreen,
                showDevices
            },
            getPlayerContainer,
            getCurrentVideo,
            handleWheelVolume,
            setVolume,
            seekTime,
            toggleFullScreen,
            toggleMute,
            togglePlay,
            toggleDevices,
            goToVideo,
            onYoutubeIframeReady,
            onYoutubeIframeStateChange
        } = this;

        const isSingleVideo = !!video.id;

        const { id: videoId, title, duration } = getCurrentVideo();

        const { isMaster } = currentDevice;

        return (
            <div
                className="player__container shadow--2dp"
                ref={getPlayerContainer}
                data-state-fullscreen={isFullScreen ? 'enabled' : 'disabled'}
                data-state-show-queue={showQueue ? 'enabled' : 'disabled'}
            >
                {isMaster ? (
                    <Screen
                        className="screen"
                        videoId={videoId}
                        onReady={onYoutubeIframeReady}
                        onEnd={goToVideo}
                        onStateChange={onYoutubeIframeStateChange}
                        data-state={
                            isSingleVideo || showScreen || isFullScreen
                                ? 'visible'
                                : 'hidden'
                        }
                    />
                ) : null}

                <Queue
                    isPlaying={isPlaying}
                    isBuffering={isBuffering}
                    togglePlay={togglePlay}
                />

                <div className="player shadow--2dp">
                    <div className="player__inner shadow--2dp">
                        <div className="player__controls">
                            {!isSingleVideo ? (
                                <Button
                                    className="player__controls-button icon-button"
                                    onClick={() => goToVideo(false)}
                                    icon="skip-previous"
                                    ariaLabel="Go to previous video"
                                />
                            ) : null}

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

                            {!isSingleVideo ? (
                                <Button
                                    className="player__controls-button icon-button"
                                    onClick={() => goToVideo(true)}
                                    icon="skip-next"
                                    ariaLabel="Go to next video"
                                />
                            ) : null}
                        </div>

                        <Info
                            title={title}
                            currentTime={currentTime}
                            duration={duration}
                            loaded={loaded}
                            onStartSeeking={isPlaying ? togglePlay : () => {}}
                            onEndSeeking={seekTime}
                        />

                        <div className="player__controls">
                            {!isMobile() ? (
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
                                        onChange={setVolume}
                                    />
                                </div>
                            ) : null}

                            {!isSingleVideo ? (
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
                            ) : null}

                            {devices.length ? (
                                <div className="player__controls-devices">
                                    <Button
                                        className={[
                                            'player__controls-button icon-button',
                                            showDevices ? 'is-active' : ''
                                        ].join(' ')}
                                        icon="devices"
                                        ariaLabel="Devices"
                                        onClick={toggleDevices}
                                    />

                                    <ul
                                        className="player__controls-devices-list"
                                        data-state={
                                            showDevices ? 'open' : 'closed'
                                        }
                                    >
                                        <li
                                            className="device"
                                            onClick={() =>
                                                setActiveDevice(
                                                    currentDevice.deviceId
                                                )
                                            }
                                        >
                                            <span className="device__desc">
                                                Current device
                                            </span>
                                            <span className="device__name">
                                                {`${currentDevice.deviceName} ${
                                                    isMaster ? '(active)' : ''
                                                }`}
                                            </span>
                                        </li>

                                        {devices.map(
                                            (
                                                {
                                                    deviceId,
                                                    deviceName,
                                                    isMaster
                                                },
                                                index
                                            ) => (
                                                <li
                                                    key={index}
                                                    className="device"
                                                    onClick={() =>
                                                        setActiveDevice(
                                                            deviceId
                                                        )
                                                    }
                                                >
                                                    <span className="device__desc">
                                                        Browser
                                                    </span>
                                                    <span className="device__name">
                                                        {`${deviceName} ${
                                                            isMaster
                                                                ? '(active)'
                                                                : ''
                                                        }`}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            ) : null}

                            {!isSingleVideo && !isFullScreen ? (
                                <Button
                                    className={[
                                        'player__controls-button icon-button',
                                        showScreen ? 'is-active' : ''
                                    ].join(' ')}
                                    onClick={() => toggleScreen(showScreen)}
                                    icon="screen"
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

const mapStateToProps = ({ app: { devices, deviceId }, player }) => {
    return {
        ...player,
        devices: devices.filter(({ deviceId: id }) => id !== deviceId),
        currentDevice: devices.find(({ deviceId: id }) => id === deviceId) || {}
    };
};

const mapDispatchToProps = {
    setActiveDevice,
    setActiveQueueItem,
    toggleQueue,
    toggleScreen
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
