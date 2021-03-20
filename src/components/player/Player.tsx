import { useCallback, useEffect, useRef, WheelEvent } from 'react';

import {
    GenericObject,
    QueueItem,
    PlayerSyncPayload,
    PlayerSyncHandlers
} from '../../../@types/alltypes';
import { YouTubePlayer } from 'youtube-player/dist/types';

import { usePlayer } from '../../store/hooks/player';

import {
    useFullscreen,
    useKeyPress,
    useMergedState,
    useUpdateEffect
} from '../../lib/hooks';
import { isMobile } from '../../lib/helpers';

import Queue from './Queue';
import Screen from './Screen';

import Button from './controls/Button';
import VolumeRange from './controls/VolumeRange';
import DevicesSelector from './controls/DevicesSelector';

import Info from './Info';
import { usePlaylistItems } from '../../store/hooks/playlist-items';
import { useDevices } from '../../store/hooks/devices';

const UNSTARTED = -1;

interface PlayerInnerState {
    isPlayerReady: boolean;
    isPlaying: boolean;
    isBuffering: boolean;
    isScreenVisible: boolean;
    isQueueVisible: boolean;
    isDevicesSelectorVisible: boolean;
    volume: number;
}

const Player = () => {
    const isStartup = useRef<boolean>(true);
    const youtube = useRef<YouTubePlayer | null>(null);
    const youtubeVolume = useRef<number>(100);

    const [
        {
            isFullscreen,
            isPlaying,
            isBuffering,
            isMuted,
            isQueueVisible,
            isScreenVisible,
            isDevicesSelectorVisible,
            volume
        },
        setPlayerState
    ] = useMergedState({
        isFullscreen: false,
        isPlaying: false,
        isBuffering: false,
        isMuted: false,
        isQueueVisible: false,
        isScreenVisible: false,
        isDevicesSelectorVisible: false,
        volume: 100
    });

    const [
        { video, queue, currentId, newQueueItems },
        { goToNextQueueItem }
    ] = usePlayer();
    const [, { editPlaylistItem }] = usePlaylistItems();

    const {
        currentDevice,
        availableDevices,
        setMasterDevice,
        synchronizePlayer,
        subscribeToPlayerSync
    } = useDevices();

    const {
        setFullscreenRef,
        subscribeToFullscreen,
        requestFullscreen,
        exitFullscreen
    } = useFullscreen();

    useKeyPress('ArrowLeft', () => goToVideo(false));
    useKeyPress('ArrowRight', () => goToVideo(true));
    useKeyPress('m', () => toggleMute());
    useKeyPress('s', () => toggleScreen());
    useKeyPress(' ', () => togglePlay());

    const { isMaster } = currentDevice;

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

    const handleToggleDevices = () =>
        setPlayerState({ isDevicesSelectorVisible: !isDevicesSelectorVisible });

    const handleSelectDevice = (deviceId: string) => {
        setPlayerState({ isDevicesSelectorVisible: false });
        setMasterDevice(deviceId);
    };

    const handleEditPlaylistItem = () => editPlaylistItem({ id: videoId });

    const updateState = (data: GenericObject) => {
        synchronizePlayer({
            action: 'update-state',
            data
        });

        setPlayerState(data);
    };

    const toggleFullscreen = () => updateState({ isFullscreen: !isFullscreen });

    const setVolume = (volume: number) => updateState({ volume });

    const toggleMute = () => updateState({ isMuted: !isMuted });

    const goToVideo = (next: boolean | undefined = true) =>
        goToNextQueueItem(next);

    const setPlaybackQuality = (value = 'hd1080') =>
        youtube.current?.setPlaybackQuality(value);

    const toggleScreen = useCallback(() => {
        const isVisible = !isScreenVisible;

        updateState({
            isScreenVisible: isVisible,
            ...(isVisible ? { isQueueVisible: false } : {})
        });
    }, [isScreenVisible]);

    const toggleQueue = useCallback(() => {
        const isVisible = !isQueueVisible;

        updateState({
            isQueueVisible: isVisible,
            ...(isVisible ? { isScreenVisible: false } : {})
        });
    }, [isQueueVisible]);

    const handleYoutubeIframeReady = (playerInstance: YouTubePlayer) => {
        youtube.current = playerInstance;
    };

    const handleYoutubeIframeStateChange = (playbackStateId: number) => {
        switch (playbackStateId) {
            case UNSTARTED:
                if (!isStartup.current) {
                    updateState({ isPlaying: true, isBuffering: false });
                } else {
                    isStartup.current = false;
                }
                break;
        }
    };

    const handlePlay = () =>
        updateState({
            isPlaying: true,
            isBuffering: false
        });

    const handlePause = () =>
        updateState({
            isPlaying: false,
            isBuffering: false
        });

    const handleSeek = (t: number) => {
        youtube.current?.seekTo(t, true);

        handlePlay();
    };

    const togglePlay = () => {
        updateState({ isPlaying: !isPlaying, isBuffering: false });
    };

    const getCurrentTime = () => {
        if (youtube.current) {
            const currentTime = youtube.current?.getCurrentTime();

            synchronizePlayer({
                action: 'update-time',
                data: { currentTime }
            });

            return currentTime;
        }

        return null;
    };

    const getLoadingProgress = () => {
        if (youtube.current) {
            const loaded = youtube.current?.getVideoLoadedFraction();

            synchronizePlayer({
                action: 'update-loading',
                data: { loaded }
            });

            return loaded;
        }

        return null;
    };

    const handleBuffering = () => {
        updateState({ isBuffering: true });

        if (isMaster) {
            setPlaybackQuality();
        }
    };

    const handleWheelVolume = ({ deltaY }: WheelEvent<HTMLDivElement>) => {
        const newVolume = deltaY < 0 ? volume + 5 : volume - 5;
        const inRange = newVolume >= 0 && newVolume <= 100;

        if (inRange) {
            setVolume(newVolume);
        }
    };

    const handleVideoEnd = () => {
        if (!isSingleVideo) {
            goToVideo();
        }
    };

    useEffect(() => {
        const actions: PlayerSyncHandlers = {
            'update-state': (state: PlayerInnerState) => setPlayerState(state)
        };

        subscribeToPlayerSync(({ action, data }: PlayerSyncPayload) => {
            const { [action]: handler } = actions;

            if (handler) {
                handler(data);
            }
        });
    }, []);

    useEffect(() => {
        youtube.current?.setVolume(volume);
    }, [volume]);

    useUpdateEffect(() => {
        if (isMuted) {
            youtubeVolume.current = volume;

            setVolume(0);
        } else {
            setVolume(youtubeVolume.current);
        }
    }, [isMuted]);

    useEffect(() => {
        if (!isPlaying) {
            youtube.current?.pauseVideo();
        } else {
            youtube.current?.playVideo();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (isMaster) {
            setPlayerState({ isScreenVisible });
        }
    }, [isMaster, isScreenVisible]);

    useUpdateEffect(() => {
        if (!isMaster) {
            return;
        }

        if (isFullscreen) {
            requestFullscreen();
        } else {
            exitFullscreen();
        }
    }, [isMaster, isFullscreen]);

    useEffect(() => {
        const unsubscribe = subscribeToFullscreen((isFullscreen: boolean) =>
            updateState({ isFullscreen })
        );

        return unsubscribe;
    }, []);

    useUpdateEffect(() => {
        if (!videoId) {
            youtube.current = null;
        }
    }, [videoId]);

    return (
        <div
            className="player__container shadow--2dp"
            ref={isMaster ? setFullscreenRef : null}
            data-state-fullscreen={isFullscreen ? 'enabled' : 'disabled'}
            data-state-show-queue={isQueueVisible ? 'enabled' : 'disabled'}
        >
            {isMaster ? (
                <Screen
                    isVisible={isSingleVideo || isScreenVisible || isFullscreen}
                    videoId={videoId}
                    onReady={handleYoutubeIframeReady}
                    onEnd={handleVideoEnd}
                    onBuffering={handleBuffering}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onStateChange={handleYoutubeIframeStateChange}
                    onClick={togglePlay}
                />
            ) : null}

            <Queue
                isVisible={isQueueVisible}
                isPlaying={isPlaying}
                isBuffering={isBuffering}
                toggleQueue={toggleQueue}
                togglePlay={togglePlay}
            />

            {availableDevices.length && !isSingleVideo ? (
                <DevicesSelector
                    isVisible={isDevicesSelectorVisible}
                    currentDevice={currentDevice}
                    devices={availableDevices}
                    onClickItem={handleSelectDevice}
                />
            ) : null}

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
                            onClick={videoId ? togglePlay : () => {}}
                            icon={
                                // isBuffering
                                //     ? 'loading'
                                //     :
                                isPlaying ? 'pause' : 'play'
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
                        isMaster={isMaster}
                        isPlaying={isPlaying}
                        title={title}
                        duration={duration}
                        getCurrentTime={getCurrentTime}
                        getLoadingProgress={getLoadingProgress}
                        onStartSeeking={handlePause}
                        onEndSeeking={handleSeek}
                    />

                    <div className="player__controls">
                        {availableDevices.length && !isSingleVideo ? (
                            <Button
                                className={[
                                    'player__controls-button icon-button',
                                    isDevicesSelectorVisible ? 'is-active' : ''
                                ].join(' ')}
                                icon="devices"
                                ariaLabel="Devices"
                                onClick={handleToggleDevices}
                            />
                        ) : null}

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
                                    isQueueVisible ? 'is-active' : '',
                                    newQueueItems && !isQueueVisible
                                        ? 'badge--active'
                                        : ''
                                ].join(' ')}
                                onClick={toggleQueue}
                                badge={newQueueItems}
                                icon="list"
                                ariaLabel={
                                    isQueueVisible
                                        ? 'Close queue'
                                        : 'Open queue'
                                }
                            />
                        ) : null}

                        {!isSingleVideo && !isFullscreen ? (
                            <Button
                                className={[
                                    'player__controls-button icon-button',
                                    isScreenVisible ? 'is-active' : ''
                                ].join(' ')}
                                onClick={toggleScreen}
                                icon="screen"
                                ariaLabel={
                                    isScreenVisible
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
                                isScreenVisible
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
