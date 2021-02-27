import { useCallback, useEffect, useRef, WheelEvent } from 'react';

import { GenericObject, QueueItem } from '../../../@types/alltypes';
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
    showScreen: boolean;
    volume: number;
    loaded: number;
    currentTime: number;
}

interface PlayerSyncPayload {
    action: string;
    data: GenericObject;
}

interface PlayerSyncHandlers {
    [key: string]: Function;
}

const Player = () => {
    const youtube = useRef<YouTubePlayer | null>(null);
    const youtubeVolume = useRef<number>(100);

    const [
        {
            isPlayerReady,
            isPlaying,
            isBuffering,
            isMuted,
            showScreen,
            volume,
            loaded,
            currentTime,
            seekingTime
        },
        setPlayerState
    ] = useMergedState({
        isPlayerReady: false,
        isPlaying: false,
        isBuffering: false,
        isMuted: false,
        showScreen: false,
        volume: 100,
        loaded: 0,
        currentTime: 0,
        seekingTime: 0
    });

    const [
        { video, queue, currentId, showQueue, newQueueItems },
        { setActiveQueueItem, toggleQueue, toggleScreen }
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
        isFullscreen,
        setFullscreenRef,
        toggleFullscreen
    } = useFullscreen();

    useKeyPress('ArrowLeft', () => goToVideo(false));
    useKeyPress('ArrowRight', () => goToVideo(true));
    useKeyPress('m', () => toggleMute());
    useKeyPress('s', () => handleToggleScreen());
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

    const handleEditPlaylistItem = () => editPlaylistItem({ id: videoId });

    const updateState = (data: GenericObject) => {
        console.log(data);
        synchronizePlayer({
            action: 'update-state',
            data
        });

        setPlayerState(data);
    };

    const setVolume = (volume: number) => updateState({ volume });

    const seekTime = (t: number) => updateState({ seekingTime: t });

    const toggleMute = () => updateState({ isMuted: !isMuted });

    const togglePlay = () =>
        updateState({ isPlaying: !isPlaying, isBuffering: false });

    const goToVideo = (next: boolean | undefined = true) => {
        const newIndex = currentQueueIndex + (next ? 1 : -1);
        const { id } = queue[newIndex] || {};

        if (id) {
            updateState({
                currentTime: 0,
                loaded: 0
            });

            setActiveQueueItem(id);
        }
    };

    const setPlaybackQuality = (value = 'hd1080') =>
        youtube.current?.setPlaybackQuality(value);

    const handleToggleScreen = useCallback(() => {
        updateState({ showScreen: !showScreen });

        if (!isMaster) {
            synchronizePlayer({
                action: 'update-state',
                data: { showScreen: !showScreen }
            });
        } else {
            toggleScreen();
        }
    }, [showScreen]);

    const handleYoutubeIframeReady = (playerInstance: YouTubePlayer) => {
        youtube.current = playerInstance;

        setPlayerState({ isPlayerReady: true });
    };

    const handleYoutubeIframeStateChange = (playbackStateId: number) => {
        switch (playbackStateId) {
            case UNSTARTED:
                youtube.current?.playVideo();
                updateState({ isPlaying: true, isBuffering: false });
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

    const handleTimeUpdate = (currentTime: number = 0) =>
        updateState({ currentTime });

    const handleLoadingUpdate = (loaded: number = 0) => updateState({ loaded });

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

    useEffect(() => {
        const actions: PlayerSyncHandlers = {
            'seek-time': ({ currentTime }: GenericObject) =>
                seekTime(currentTime),
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
        if (isPlayerReady) youtube.current?.setVolume(volume);
    }, [isPlayerReady, isMaster, volume]);

    useUpdateEffect(() => {
        if (isMuted) {
            youtubeVolume.current = volume;

            setVolume(0);
        } else {
            setVolume(youtubeVolume.current);
        }
    }, [isMuted]);

    useEffect(() => {
        if (!isPlayerReady) {
            return;
        }
        if (!isPlaying) {
            youtube.current?.pauseVideo();
        } else {
            youtube.current?.playVideo();
        }
    }, [isPlayerReady, isPlaying]);

    useEffect(() => {
        if (isPlayerReady) {
            youtube.current?.seekTo(seekingTime, true);

            updateState({ currentTime: seekingTime });

            togglePlay();
        }
    }, [seekingTime]);

    useEffect(() => {
        if (isMaster) {
            setPlayerState({ showScreen });
        }
    }, [isMaster, showScreen]);

    useUpdateEffect(() => {
        if (!videoId) {
            youtube.current = null;

            setPlayerState({ isPlayerReady: false });
        } else {
            togglePlay();
        }
    }, [videoId]);

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
                    onClick={togglePlay}
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
                        title={title}
                        currentTime={currentTime}
                        duration={duration}
                        loaded={loaded}
                        onStartSeeking={isPlaying ? togglePlay : () => {}}
                        onEndSeeking={seekTime}
                    />

                    <div className="player__controls">
                        {availableDevices.length && !isSingleVideo ? (
                            <DevicesSelector
                                currentDevice={currentDevice}
                                devices={availableDevices}
                                onClickItem={setMasterDevice}
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
                                    showQueue ? 'is-active' : '',
                                    newQueueItems && !showQueue
                                        ? 'badge--active'
                                        : ''
                                ].join(' ')}
                                onClick={toggleQueue}
                                badge={newQueueItems}
                                icon="list"
                                ariaLabel={
                                    showQueue ? 'Close queue' : 'Open queue'
                                }
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
                                    showScreen ? 'Close screen' : 'open screen'
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
    );
};

export default Player;
