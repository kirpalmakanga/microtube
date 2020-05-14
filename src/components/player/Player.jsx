import { Component } from 'react';
import { connect } from 'react-redux';

import { listen, publish } from '../../api/socket';

import { setActiveDevice } from '../../actions/app';

import {
    setActiveQueueItem,
    toggleQueue,
    toggleScreen,
    editPlaylistItem
} from '../../actions/youtube';

import { isMobile } from '../../lib/helpers';

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

const UNSTARTED = -1;
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
            showScreen: false,
            volume: 100,
            loaded: 0,
            currentTime: 0,
            youtube: null
        };
    }

    updateState = (data) => {
        const {
            currentDevice: { isMaster }
        } = this.props;

        if (isMaster) {
            publish('player:sync', {
                action: 'update-state',
                data
            });
        }

        this.setState(data);
    };

    getPlayerContainer = (el) => (this._container = el);

    isPlayerReady = () => {
        const {
            state: { youtube },
            props: {
                video: { id }
            }
        } = this;

        return !!youtube && id;
    };

    setVolume = (volume) => {
        const {
            props: {
                currentDevice: { isMaster }
            },
            state: { youtube },
            updateState
        } = this;

        if (!isMaster) {
            publish('player:sync', {
                action: 'set-volume',
                data: { volume }
            });

            return;
        }

        if (!this.isPlayerReady()) {
            return;
        }

        if (volume > 0) {
            youtube.unMute();
        }
        youtube.setVolume(volume);

        updateState({ volume });
    };

    seekTime = (t) => {
        const {
            props: {
                currentDevice: { isMaster }
            },
            togglePlay,
            updateState
        } = this;

        if (!isMaster) {
            publish('player:sync', {
                action: 'seek-time',
                data: { currentTime: t }
            });

            return;
        }

        if (!this.isPlayerReady()) {
            return;
        }

        const { isPlaying, youtube } = this.state;

        youtube.seekTo(t);

        updateState({ currentTime: t });

        setTimeout(() => {
            if (!isPlaying) {
                togglePlay();
            }
        });
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
            props: {
                currentDevice: { isMaster }
            },
            state: { isMuted, youtube },
            updateState
        } = this;

        if (!isMaster) {
            publish('player:sync', {
                action: 'toggle-mute'
            });

            return;
        }

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
        const {
            props: {
                currentDevice: { isMaster }
            },
            state: { isPlaying, youtube },
            isPlayerReady
        } = this;

        if (!isMaster) {
            publish('player:sync', {
                action: 'toggle-play'
            });

            return;
        }

        if (!isPlayerReady()) {
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

    goToVideo = (next = true) => {
        const {
            props: { queue, currentQueueIndex, setActiveQueueItem },
            updateState
        } = this;

        const newIndex = currentQueueIndex + (next ? 1 : -1);
        const { id } = queue[newIndex] || {};

        if (!id) {
            return;
        }

        updateState({
            currentTime: 0,
            loaded: 0
        });

        setActiveQueueItem(id);
    };

    setPlaybackQuality = (value = 'hd1080') => {
        const { youtube } = this.state;

        youtube.setPlaybackQuality(value);
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

    toggleScreen = () => {
        this.updateState({ showScreen: !this.state.showScreen });

        publish('player:sync', {
            action: 'update-state',
            data: { showScreen: !this.state.showScreen }
        });

        this.props.toggleScreen();
    };

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

    handleYoutubeIframeReady = ({ target: youtube }) => {
        youtube.pauseVideo();

        this.setState({ youtube }, () => {
            this.setPlaybackQuality();
        });
    };

    handleYoutubeIframeStateChange = ({ data }) => {
        const { updateState } = this;
        switch (data) {
            case UNSTARTED:
                updateState({ isPlaying: false });

                break;

            case CUED:
                this.togglePlay();

                break;
        }
    };

    handleTimeUpdate = (currentTime) => this.updateState({ currentTime });

    handleLoadingUpdate = (loaded) => this.updateState({ loaded });

    handlePlay = () =>
        this.updateState({ isPlaying: true, isBuffering: false });

    handlePause = () => this.updateState({ isPlaying: false });

    handleBuffering = () => {
        const { updateState, setPlaybackQuality } = this;

        updateState({ isBuffering: true });

        setPlaybackQuality();
    };

    handleWheelVolume = ({ deltaY }) => {
        const {
            state: { volume },
            setVolume
        } = this;

        const newVolume = deltaY < 0 ? volume + 5 : volume - 5;
        const inRange = newVolume >= 0 && newVolume <= 100;

        if (inRange) {
            setVolume(newVolume);
        }
    };

    bindFullScreenChange = () =>
        listenFullScreenChange(this._container, (isFullScreen) =>
            this.setState({ isFullScreen })
        );

    bindDevicesSync = () => {
        const actions = {
            'toggle-play': this.togglePlay,
            'toggle-mute': this.toggleMute,
            'set-volume': ({ volume }) => this.setVolume(volume),
            'seek-time': ({ currentTime }) => this.seekTime(currentTime),
            'update-state': (state) => this.setState(state)
        };

        listen('player:sync', ({ action, data = {} } = {}) => {
            const handler = actions[action];

            if (handler) {
                handler(data);
            }
        });
    };

    componentDidUpdate({ showScreen: prevShowScreen }) {
        const {
            props: {
                currentDevice: { isMaster },
                showScreen
            }
        } = this;

        if (isMaster && showScreen !== prevShowScreen) {
            this.setState({ showScreen });
        }
    }

    componentDidMount() {
        this.bindDevicesSync();

        this.bindFullScreenChange();

        this.bindKeyboard();
    }

    componentWillUnmount() {
        this.unbindKeyboard();
    }

    render() {
        const {
            props: {
                video: { id: videoId, title, duration },
                isSingleVideo,
                showQueue,
                newQueueItems,
                toggleQueue,
                editPlaylistItem,
                devices,
                currentDevice,
                setActiveDevice
            },
            state: {
                currentTime,
                loaded,
                volume,
                isPlaying,
                isBuffering,
                isMuted,
                isFullScreen,
                showDevices,
                showScreen
            },
            getPlayerContainer,
            handleWheelVolume,
            handleTimeUpdate,
            handleLoadingUpdate,
            handleBuffering,
            handlePlay,
            handlePause,
            setVolume,
            seekTime,
            toggleFullScreen,
            toggleMute,
            togglePlay,
            toggleDevices,
            toggleScreen,
            goToVideo,
            handleYoutubeIframeReady,
            handleYoutubeIframeStateChange
        } = this;

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
                        onReady={handleYoutubeIframeReady}
                        onEnd={!isSingleVideo ? goToVideo : () => {}}
                        onBuffering={handleBuffering}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onStateChange={handleYoutubeIframeStateChange}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadingUpdate={handleLoadingUpdate}
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

                            {!isSingleVideo && devices.length ? (
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
                                    onClick={toggleScreen}
                                    icon="screen"
                                    ariaLabel={
                                        showScreen
                                            ? 'Close screen'
                                            : 'open screen'
                                    }
                                />
                            ) : null}

                            {isSingleVideo ? (
                                <Button
                                    className="player__controls-button icon-button"
                                    onClick={() => editPlaylistItem(videoId)}
                                    icon="playlist-add"
                                    ariaLabel="Add to playlist"
                                ></Button>
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

const mapStateToProps = ({
    app: { devices, deviceId },
    player: { video, queue, currentId, ...player }
}) => {
    const currentQueueIndex = queue.findIndex(({ id }) => id === currentId);

    return {
        ...player,
        currentQueueIndex,
        queue,
        isSingleVideo: !!video.id,
        video: video.id
            ? video
            : queue[currentQueueIndex] || {
                  id: '',
                  title: 'No video.',
                  duration: 0
              },
        devices: devices.filter(({ deviceId: id }) => id !== deviceId),
        currentDevice: devices.find(({ deviceId: id }) => id === deviceId) || {
            isMaster: true
        }
    };
};

const mapDispatchToProps = {
    setActiveDevice,
    setActiveQueueItem,
    editPlaylistItem,
    toggleQueue,
    toggleScreen
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
