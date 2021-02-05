import { useEffect, useCallback, useRef } from 'react';

import { useStore } from '../../store';
import { usePlayer } from '../../store/hooks/player';

// import { listen, publish } from '../../api/socket';

// import { setActiveDevice } from '../../store/actions/app';

// import {
//     editPlaylistItem
// } from '../../store/actions/youtube';

import { useFullscreen, useKeyPress, useMergedState } from '../../lib/hooks';
import { isMobile } from '../../lib/helpers';

import Queue from './Queue';
import Screen from './Screen';

import Button from './controls/Button';
import VolumeRange from './controls/VolumeRange';
// import DevicesSelector from './controls/DevicesSelector';

import Info from './Info';
import { QueueItem } from '../../store/reducers/_player';
import { GenericObject } from '../../..';
import { YouTubePlayer } from 'youtube-player/dist/types';

interface PlayerState {
    isPlayerReady: boolean;
    isPlaying: boolean;
    isBuffering: boolean;
    showScreen: boolean;
    volume: number;
    loaded: number;
    currentTime: number;
}

interface Device {
    deviceId: string;
    isMaster: boolean;
}

const UNSTARTED = -1;
const CUED = 5;

const Player = () => {
    const youtube = useRef<YouTubePlayer | null>(null);
    const youtubeVolume = useRef<number>(100);

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

    const [
        {
            app: { devices, deviceId },
            player: {}
        }
    ] = useStore();

    const [
        { video, queue, currentId, showQueue, newQueueItems, ...player },
        { setActiveQueueItem, toggleQueue, toggleScreen }
    ] = usePlayer();

    const {
        isFullscreen,
        setFullscreenRef,
        toggleFullscreen
    } = useFullscreen();

    useKeyPress('ArrowLeft', () => goToVideo(false));
    useKeyPress('ArrowRight', () => goToVideo(true));
    useKeyPress('m', () => toggleMute());
    useKeyPress('s', () => handleToggleScreen());
    useKeyPress(' ', () => togglePlay());

    const editPlaylistItem = () => {};

    const currentQueueIndex = queue.findIndex(
        ({ id }: QueueItem) => id === currentId
    );

    const isSingleVideo = !!video.id;

    const { id: videoId, title, duration } = video.id
        ? video
        : queue[currentQueueIndex] || {
              id: '',
              title: 'No video.',
              duration: 0
          };

    const availableDevices = devices.filter(
        ({ deviceId: id }: Device) => id !== deviceId
    );
    const currentDevice = availableDevices.find(
        ({ deviceId: id }: Device) => id === deviceId
    ) || {
        isMaster: true
    };

    const { isMaster } = currentDevice;

    const updateState = (data: GenericObject) => {
        // if (isMaster) {
        //     publish('player:sync', {
        //         action: 'update-state',
        //         data
        //     });
        // }

        setPlayerState(data);
    };

    const setVolume = useCallback(
        (volume) => {
            // if (!isMaster) {
            //     publish('player:sync', {
            //         action: 'set-volume',
            //         data: { volume }
            //     });

            //     return;
            // }

            if (!isPlayerReady) {
                return;
            }

            youtube.current?.setVolume(volume);

            updateState({ volume });
        },
        [isPlayerReady]
    );

    const seekTime = useCallback((t) => {
        // if (!isMaster) {
        //     publish('player:sync', {
        //         action: 'seek-time',
        //         data: { currentTime: t }
        //     });
        // } else
        if (isPlayerReady) {
            youtube.current?.seekTo(t, true);

            updateState({ currentTime: t });

            setTimeout(() => {
                if (!isPlaying) {
                    togglePlay();
                }
            });
        }
    }, []);

    const toggleMute = useCallback(() => {
        // if (!isMaster) {
        //     publish('player:sync', {
        //         action: 'toggle-mute'
        //     });

        //     return;
        // }

        if (!isPlayerReady) {
            return;
        }

        if (volume > 0) {
            youtubeVolume.current = volume;

            setVolume(0);
        } else {
            setVolume(youtubeVolume.current);
        }
    }, [volume]);

    const togglePlay = useCallback(
        (force = false) => {
            // if (!isMaster) {
            //     publish('player:sync', {
            //         action: 'toggle-play'
            //     });

            //     return;
            // }

            if (!isPlayerReady) {
                return;
            }

            if (!isPlaying || force === true) {
                youtube.current?.playVideo();
            } else if (isPlaying) {
                youtube.current?.pauseVideo();
            }
        },
        [isPlaying]
    );

    const goToVideo = useCallback(
        (next: boolean | undefined = true) => {
            const newIndex = currentQueueIndex + (next ? 1 : -1);
            const { id } = queue[newIndex] || {};

            if (id) {
                updateState({
                    currentTime: 0,
                    loaded: 0
                });

                setActiveQueueItem(id);
            }
        },
        [currentQueueIndex, queue]
    );

    const setPlaybackQuality = useCallback(
        (value = 'hd1080') => youtube.current?.setPlaybackQuality(value),
        [youtube]
    );

    const handleToggleScreen = useCallback(() => {
        updateState({ showScreen: !showScreen });

        // publish('player:sync', {
        //     action: 'update-state',
        //     data: { showScreen: !showScreen }
        // });

        toggleScreen();
    }, [showScreen]);

    const handleYoutubeIframeReady = useCallback((playerInstance) => {
        youtube.current = playerInstance;

        setPlayerState({ isPlayerReady: true });
    }, []);

    const handleYoutubeIframeStateChange = useCallback(
        (playbackStateId: number) => {
            switch (playbackStateId) {
                case UNSTARTED:
                    updateState({ isPlaying: false });

                    break;

                case CUED:
                    togglePlay(true);

                    break;
            }
        },
        []
    );

    const handleTimeUpdate = useCallback(
        (currentTime) => updateState({ currentTime }),
        []
    );

    const handleLoadingUpdate = useCallback(
        (loaded) => updateState({ loaded }),
        []
    );

    const handlePlay = useCallback(
        () => updateState({ isPlaying: true, isBuffering: false }),
        []
    );

    const handlePause = useCallback(
        () => updateState({ isPlaying: false }),
        []
    );

    const handleBuffering = useCallback(() => {
        updateState({ isBuffering: true });

        setPlaybackQuality();
    }, []);

    const handleWheelVolume = useCallback(({ deltaY }) => {
        const newVolume = deltaY < 0 ? volume + 5 : volume - 5;
        const inRange = newVolume >= 0 && newVolume <= 100;

        if (inRange) {
            setVolume(newVolume);
        }
    }, []);

    // const bindDevicesSync =  useCallback(() => {
    //     const actions = {
    //         'toggle-play': () => togglePlay(),
    //         'toggle-mute': () => toggleMute(),
    //         'set-volume': ({ volume }) => setVolume(volume),
    //         'seek-time': ({ currentTime }) => seekTime(currentTime),
    //         'update-state': (state) => setPlayerState(state)
    //     };

    //     listen('player:sync', ({ action, data = {} } = {}) => {
    //         const handler = actions[action];

    //         if (handler) {
    //             handler(data);
    //         }
    //     });
    // }, []);

    useEffect(() => {
        // bindDevicesSync();
    }, [isPlayerReady]);

    useEffect(() => {
        if (isMaster) {
            setPlayerState({ showScreen });
        }
    }, [showScreen]);

    return (
        <div
            className="player__container shadow--2dp"
            ref={setFullscreenRef}
            data-state-fullscreen={isFullscreen ? 'enabled' : 'disabled'}
            data-state-show-queue={showQueue ? 'enabled' : 'disabled'}
        >
            {isMaster ? (
                <Screen
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
                            ariaLabel={isPlaying ? 'Pause video' : 'Play video'}
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
                        onStartSeeking={isPlaying ? togglePlay : () => {}}
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
                                    ariaLabel={volume === 0 ? 'Unmute' : 'Mute'}
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
                                onClick={toggleQueue}
                                icon="list"
                                ariaLabel={
                                    showQueue ? 'Close queue' : 'Open queue'
                                }
                            />
                        ) : null}

                        {/* {devices.length && !isSingleVideo ? (
                                    <DevicesSelector
                                        currentItem={currentDevice}
                                        devices={devices}
                                        onClickItem={setActiveDevice}
                                    />
                                ) : null} */}

                        {!isSingleVideo && !isFullscreen ? (
                            <Button
                                className={[
                                    'player__controls-button icon-button',
                                    showScreen ? 'is-active' : ''
                                ].join(' ')}
                                onClick={handleToggleScreen}
                                icon="screen"
                                ariaLabel={
                                    showScreen ? 'Close screen' : 'open screen'
                                }
                            />
                        ) : null}

                        {isSingleVideo ? (
                            <Button
                                className="player__controls-button icon-button"
                                onClick={editPlaylistItem}
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
    );
};

export default Player;
