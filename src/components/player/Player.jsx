import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { listen, publish } from '../../api/socket';

import { setActiveDevice } from '../../store/actions/app';

import {
    setActiveQueueItem,
    toggleQueue,
    toggleScreen,
    editPlaylistItem
} from '../../store/actions/youtube';

import { isMobile } from '../../lib/helpers';

import Queue from './Queue';
import Screen from './Screen';

import Button from './controls/Button';
import VolumeRange from './controls/VolumeRange';
import DevicesSelector from './controls/DevicesSelector';

import Info from './Info';

import FullscreenWrapper from '../FullscreenWrapper';

const UNSTARTED = -1;
const CUED = 5;

const useMergedState = (initialState) => {
    const [mergedState, setState] = useState(initialState);
    const setMergedState = useCallback(
        (newState = {}) => setState((state) => ({ ...state, ...newState })),
        [mergedState]
    );

    return [mergedState, setMergedState];
};

const Player = () => {
    const dispatch = useDispatch();
    const keyboardHandler = useRef(null);
    const youtube = useRef(null);
    const youtubeVolume = useRef(100);

    const {
        queue,
        showQueue,
        newQueueItems,
        currentQueueIndex,
        devices,
        currentDevice,
        isSingleVideo,
        video: { id: videoId, title, duration } = {}
    } = useSelector(
        ({
            app: { devices, deviceId },
            player: { video, queue, currentId, ...player }
        }) => {
            const currentQueueIndex = queue.findIndex(
                ({ id }) => id === currentId
            );

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
                currentDevice: devices.find(
                    ({ deviceId: id }) => id === deviceId
                ) || {
                    isMaster: true
                }
            };
        }
    );

    const { isMaster } = currentDevice;

    const [
        {
            isPlayerReady,
            isPlaying,
            isBuffering,
            showScreen,
            volume,
            loaded,
            currentTime
        },
        setPlayerState
    ] = useMergedState({
        isPlayerReady: false,
        isPlaying: false,
        isBuffering: false,
        showScreen: false,
        volume: 100,
        loaded: 0,
        currentTime: 0
    });

    const updateState = (data) => {
        if (isMaster) {
            publish('player:sync', {
                action: 'update-state',
                data
            });
        }

        setPlayerState(data);
    };

    const setVolume = (volume) => {
        if (!isMaster) {
            publish('player:sync', {
                action: 'set-volume',
                data: { volume }
            });

            return;
        }

        if (!isPlayerReady) {
            return;
        }

        youtube.current.setVolume(volume);

        updateState({ volume });
    };

    const seekTime = (t) => {
        if (!isMaster) {
            publish('player:sync', {
                action: 'seek-time',
                data: { currentTime: t }
            });
        } else if (isPlayerReady) {
            youtube.current.seekTo(t);

            updateState({ currentTime: t });

            setTimeout(() => {
                if (!isPlaying) {
                    togglePlay();
                }
            });
        }
    };

    const toggleMute = () => {
        if (!isMaster) {
            publish('player:sync', {
                action: 'toggle-mute'
            });

            return;
        }

        if (!isPlayerReady) {
            return;
        }

        if (volume > 0) {
            youtubeVolume.current = volume;

            setVolume(0);
        } else {
            setVolume(youtubeVolume.current);
        }
    };

    const togglePlay = (force = false) => {
        if (!isMaster) {
            publish('player:sync', {
                action: 'toggle-play'
            });

            return;
        }

        if (!isPlayerReady) {
            return;
        }

        if (!isPlaying || force === true) {
            youtube.current.playVideo();
        } else if (isPlaying) {
            youtube.current.pauseVideo();
        }
    };

    const goToVideo = (next = true) => {
        const newIndex = currentQueueIndex + (next ? 1 : -1);
        const { id } = queue[newIndex] || {};

        if (id) {
            updateState({
                currentTime: 0,
                loaded: 0
            });

            dispatch(setActiveQueueItem(id));
        }
    };

    const setPlaybackQuality = (value = 'hd1080') =>
        youtube && youtube.current.setPlaybackQuality(value);

    const bindKeyboard = () => {
        if (keyboardHandler.current) {
            return;
        }

        const callbacks = {
            ArrowLeft: () => goToVideo(false),

            ArrowRight: () => goToVideo(true),

            m: toggleMute,

            q: handleToggleQueue,

            s: handleToggleScreen,

            ' ': togglePlay
        };

        keyboardHandler.current = ({ key, repeat }) => {
            const handler = callbacks[key];

            if (handler && !repeat) {
                handler();
            }
        };

        document.addEventListener('keydown', keyboardHandler.current);
    };

    const unbindKeyboard = () => {
        document.removeEventListener('keydown', keyboardHandler.current);

        keyboardHandler.current = null;
    };

    const handleEditPlaylistItem = () => dispatch(editPlaylistItem(videoId));

    const handleSetActiveDevice = (id) => dispatch(setActiveDevice(id));

    const handleToggleScreen = () => {
        updateState({ showScreen: !showScreen });

        publish('player:sync', {
            action: 'update-state',
            data: { showScreen: !showScreen }
        });

        dispatch(toggleScreen());
    };

    const handleToggleQueue = () => dispatch(toggleQueue());

    const handleYoutubeIframeReady = ({ target }) => {
        youtube.current = target;

        setPlayerState({ isPlayerReady: true });
    };

    const handleYoutubeIframeStateChange = ({ data }) => {
        switch (data) {
            case UNSTARTED:
                updateState({ isPlaying: false });

                break;

            case CUED:
                togglePlay(true);

                break;
        }
    };

    const handleTimeUpdate = (currentTime) => updateState({ currentTime });

    const handleLoadingUpdate = (loaded) => updateState({ loaded });

    const handlePlay = () =>
        updateState({ isPlaying: true, isBuffering: false });

    const handlePause = () => updateState({ isPlaying: false });

    const handleBuffering = () => {
        updateState({ isBuffering: true });

        setPlaybackQuality();
    };

    const handleWheelVolume = ({ deltaY }) => {
        const newVolume = deltaY < 0 ? volume + 5 : volume - 5;
        const inRange = newVolume >= 0 && newVolume <= 100;

        if (inRange) {
            setVolume(newVolume);
        }
    };

    const bindDevicesSync = () => {
        const actions = {
            'toggle-play': () => togglePlay(),
            'toggle-mute': () => toggleMute(),
            'set-volume': ({ volume }) => setVolume(volume),
            'seek-time': ({ currentTime }) => seekTime(currentTime),
            'update-state': (state) => setPlayerState(state)
        };

        listen('player:sync', ({ action, data = {} } = {}) => {
            const handler = actions[action];

            if (handler) {
                handler(data);
            }
        });
    };

    useEffect(() => {
        bindDevicesSync();

        bindKeyboard();

        return unbindKeyboard;
    }, [isPlayerReady]);

    useEffect(() => {
        if (isMaster) {
            setPlayerState({ showScreen });
        }
    }, [showScreen]);

    return (
        <FullscreenWrapper>
            {({ containerRef, toggleFullscreen, isFullscreen }) => (
                <div
                    className="player__container shadow--2dp"
                    ref={containerRef}
                    data-state-fullscreen={
                        isFullscreen ? 'enabled' : 'disabled'
                    }
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
                                isSingleVideo || showScreen || isFullscreen
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
                                        icon="chevron-left"
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
                                        icon="chevron-right"
                                        ariaLabel="Go to next video"
                                    />
                                ) : null}
                            </div>

                            <Info
                                title={title}
                                currentTime={currentTime}
                                duration={duration}
                                loaded={loaded}
                                onStartSeeking={
                                    isPlaying ? togglePlay : () => {}
                                }
                                onEndSeeking={seekTime}
                            />

                            <div className="player__controls">
                                {!isMobile() && videoId ? (
                                    <div
                                        className="player__controls-volume"
                                        onWheel={handleWheelVolume}
                                    >
                                        <Button
                                            className="player__controls-button icon-button"
                                            onClick={toggleMute}
                                            icon={
                                                volume === 0
                                                    ? 'volume-off'
                                                    : 'volume-up'
                                            }
                                            ariaLabel={
                                                volume === 0 ? 'Unmute' : 'Mute'
                                            }
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
                                        onClick={handleToggleQueue}
                                        badge={newQueueItems}
                                        icon="list"
                                        ariaLabel={
                                            showQueue
                                                ? 'Close queue'
                                                : 'Open queue'
                                        }
                                    />
                                ) : null}

                                {devices.length && !isSingleVideo ? (
                                    <DevicesSelector
                                        currentItem={currentDevice}
                                        devices={devices}
                                        onClickItem={handleSetActiveDevice}
                                    />
                                ) : null}

                                {!isSingleVideo && !isFullscreen ? (
                                    <Button
                                        className={[
                                            'player__controls-button icon-button',
                                            showScreen ? 'is-active' : ''
                                        ].join(' ')}
                                        onClick={handleToggleScreen}
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
                                        onClick={handleEditPlaylistItem}
                                        icon="folder-add"
                                        ariaLabel="Save to playlist"
                                    ></Button>
                                ) : null}

                                <Button
                                    className="player__controls-button icon-button"
                                    onClick={toggleFullscreen}
                                    icon={isFullscreen ? 'close' : 'expand'}
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
            )}
        </FullscreenWrapper>
    );
};

export default Player;
