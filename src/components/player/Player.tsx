import { createEffect, onCleanup, onMount, Show } from 'solid-js';
import {
    GenericObject,
    PlayerSyncPayload,
    PlayerSyncHandlers,
    HTMLElementWheelEvent
} from '../../../@types/alltypes';
import { YouTubePlayer } from 'youtube-player/dist/types';

import { usePlayer } from '../../store/hooks/player';

import { useFullscreen, useKeyboard } from '../../lib/hooks';
import { isMobile } from '../../lib/helpers';

import Queue from './Queue';
import Screen from './Screen';

import Button from './controls/Button';
import VolumeRange from './controls/VolumeRange';
import DevicesSelector from './controls/DevicesSelector';

import Info from './Info';
import { usePlaylistItems } from '../../store/hooks/playlist-items';
import { useDevices } from '../../store/hooks/devices';
import { createStore } from 'solid-js/store';
import { Transition } from 'solid-transition-group';

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
    let isStartup: boolean = true;
    let youtube: YouTubePlayer | null;
    let youtubeVolume: number = 100;
    let unsubscribeFromFullscreen: () => void;

    const [state, setPlayerState] = createStore({
        isFullscreen: false,
        isPlaying: false,
        isBuffering: false,
        isMuted: false,
        isQueueVisible: false,
        isScreenVisible: false,
        isDevicesSelectorVisible: false,
        volume: 100
    });

    const [storeState, { goToNextQueueItem }] = usePlayer();

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

    const isSingleVideo = () => !!storeState.video.id;

    const handleToggleDevices = () =>
        setPlayerState({
            isDevicesSelectorVisible: !state.isDevicesSelectorVisible
        });

    const handleSelectDevice = (deviceId: string) => {
        setPlayerState({ isDevicesSelectorVisible: false });
        setMasterDevice(deviceId);
    };

    const handleEditPlaylistItem = () =>
        editPlaylistItem({ id: storeState.currentVideo.id });

    const updateState = (data: GenericObject) => {
        setPlayerState(data);

        synchronizePlayer({
            action: 'update-state',
            data
        });
    };

    const toggleFullscreen = () =>
        updateState({ isFullscreen: !state.isFullscreen });

    const setVolume = (volume: number) => updateState({ volume });

    const toggleMute = () => updateState({ isMuted: !state.isMuted });

    const goToVideo = (next: boolean | undefined = true) =>
        goToNextQueueItem(next);

    const toggleScreen = () => {
        const isVisible = !state.isScreenVisible;

        updateState({
            isScreenVisible: isVisible,
            ...(isVisible && !availableDevices.length
                ? { isQueueVisible: false }
                : {})
        });
    };

    const toggleQueue = () => {
        const isVisible = !state.isQueueVisible;

        setPlayerState({
            isQueueVisible: isVisible,
            ...(isVisible && !availableDevices.length
                ? { isScreenVisible: false }
                : {})
        });
    };

    const handleYoutubeIframeReady = (playerInstance: YouTubePlayer) => {
        youtube = playerInstance;
    };

    const handleYoutubeIframeStateChange = (playbackStateId: number) => {
        switch (playbackStateId) {
            case UNSTARTED:
                if (!isStartup) {
                    updateState({ isPlaying: true, isBuffering: false });
                } else {
                    isStartup = false;
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

    const handleSeeking = (currentTime: number) => {
        youtube?.seekTo(currentTime, true);

        handlePlay();
    };

    const handleBuffering = () => updateState({ isBuffering: true });

    const togglePlay = () => {
        if (storeState.currentVideo.id)
            updateState({ isPlaying: !state.isPlaying, isBuffering: false });
    };

    const getCurrentTime = () => {
        if (youtube) {
            const currentTime = youtube.getCurrentTime();

            synchronizePlayer({
                action: 'update-time',
                data: { currentTime }
            });

            return currentTime;
        }

        return null;
    };

    const getLoadingProgress = () => {
        if (youtube) {
            const loaded = youtube?.getVideoLoadedFraction();

            synchronizePlayer({
                action: 'update-loading',
                data: { loaded }
            });

            return loaded;
        }

        return null;
    };

    const handleWheelVolume = ({ deltaY }: HTMLElementWheelEvent) => {
        const newVolume = state.volume + (deltaY < 0 ? 5 : -5);
        const inRange = newVolume >= 0 && newVolume <= 100;

        if (inRange) {
            setVolume(newVolume);
        }
    };

    const handleVideoEnd = () => {
        if (!isSingleVideo()) {
            goToVideo();
        }
    };

    useKeyboard('ArrowLeft', () => goToVideo(false), 'keypress');
    useKeyboard('ArrowRight', () => goToVideo(true), 'keypress');
    useKeyboard('m', () => toggleMute(), 'keypress');
    useKeyboard('s', () => toggleScreen(), 'keypress');
    useKeyboard(' ', () => togglePlay(), 'keypress');

    createEffect(() => {
        youtube?.setVolume(state.volume);

        return state.volume;
    }, state.volume);

    createEffect((previousIsMuted) => {
        if (previousIsMuted === state.isMuted) return previousIsMuted;

        if (state.isMuted) {
            youtubeVolume = state.volume;

            setVolume(0);
        } else {
            setVolume(youtubeVolume);
        }

        return state.isMuted;
    }, state.isMuted);

    createEffect(() => {
        if (!state.isPlaying) {
            youtube?.pauseVideo();
        } else {
            youtube?.playVideo();
        }

        return state.isPlaying;
    }, state.isPlaying);

    createEffect(() => {
        if (currentDevice.isMaster) {
            setPlayerState({ isScreenVisible: state.isScreenVisible });
        }

        return [currentDevice.isMaster, state.isScreenVisible];
    }, [currentDevice.isMaster, state.isScreenVisible]);

    createEffect(() => {
        if (!currentDevice.isMaster) {
            return;
        }

        if (state.isFullscreen) {
            requestFullscreen();
        } else {
            exitFullscreen();
        }

        return [currentDevice.isMaster, state.isFullscreen];
    }, [currentDevice.isMaster, state.isFullscreen]);

    createEffect(() => {
        const { videoId } = storeState.currentVideo.id;

        if (!videoId) youtube = null;

        return videoId;
    }, storeState.currentVideo.id);

    onMount(() => {
        const actions: PlayerSyncHandlers = {
            'update-state': (state: PlayerInnerState) => setPlayerState(state)
        };

        subscribeToPlayerSync(({ action, data }: PlayerSyncPayload) => {
            const { [action]: handler } = actions;

            if (handler) {
                handler(data);
            }
        });

        unsubscribeFromFullscreen = subscribeToFullscreen(
            (isFullscreen: boolean) => updateState({ isFullscreen })
        );
    });

    onCleanup(() => unsubscribeFromFullscreen());

    return (
        <div
            className="player__container shadow--2dp"
            ref={setFullscreenRef}
            data-state-fullscreen={state.isFullscreen ? 'enabled' : 'disabled'}
            data-state-show-queue={
                state.isQueueVisible ? 'enabled' : 'disabled'
            }
        >
            <Transition name="fade" appear={true}>
                <Show
                    when={
                        (currentDevice.isMaster && isSingleVideo()) ||
                        state.isScreenVisible ||
                        state.isFullscreen
                    }
                >
                    <Screen
                        videoId={storeState.currentVideo.id}
                        onReady={handleYoutubeIframeReady}
                        onEnd={handleVideoEnd}
                        onBuffering={handleBuffering}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onStateChange={handleYoutubeIframeStateChange}
                        onClick={togglePlay}
                    />
                </Show>
            </Transition>

            <Transition name="slide-up" appear={true}>
                <Show when={state.isQueueVisible}>
                    <Queue
                        isPlaying={state.isPlaying}
                        isBuffering={state.isBuffering}
                        toggleQueue={toggleQueue}
                        togglePlay={togglePlay}
                    />
                </Show>
            </Transition>

            <Transition name="slide-up">
                <Show when={availableDevices.length && !isSingleVideo()}>
                    <DevicesSelector
                        currentDevice={currentDevice}
                        devices={availableDevices}
                        onClickItem={handleSelectDevice}
                    />
                </Show>
            </Transition>

            <div className="player shadow--2dp">
                <div className="player__inner shadow--2dp">
                    <Show when={!isSingleVideo()}>
                        <Button
                            className="player__controls-button icon-button"
                            onClick={() => goToVideo(false)}
                            icon="chevron-left"
                            ariaLabel="Go to previous video"
                        />
                    </Show>

                    <Button
                        className="player__controls-button icon-button"
                        onClick={togglePlay}
                        icon={
                            state.isBuffering
                                ? 'loading'
                                : state.isPlaying
                                ? 'pause'
                                : 'play'
                        }
                        ariaLabel={
                            state.isPlaying ? 'Pause video' : 'Play video'
                        }
                    />

                    <Show when={!isSingleVideo()}>
                        <Button
                            className="player__controls-button icon-button"
                            onClick={() => goToVideo(true)}
                            icon="chevron-right"
                            ariaLabel="Go to next video"
                        />
                    </Show>

                    <Info
                        isWatchingDisabled={
                            state.isBuffering ||
                            !state.isPlaying ||
                            !currentDevice.isMaster
                        }
                        videoId={storeState.currentVideo.id}
                        title={storeState.currentVideo.title}
                        duration={storeState.currentVideo.duration}
                        getCurrentTime={getCurrentTime}
                        getLoadingProgress={getLoadingProgress}
                        onStartSeeking={handlePause}
                        onEndSeeking={handleSeeking}
                    />

                    <Show when={availableDevices.length && !isSingleVideo()}>
                        <Button
                            className={[
                                'player__controls-button icon-button',
                                state.isDevicesSelectorVisible
                                    ? 'is-active'
                                    : ''
                            ].join(' ')}
                            icon="devices"
                            ariaLabel="Devices"
                            onClick={handleToggleDevices}
                        />
                    </Show>

                    <Show when={!isMobile() && storeState.currentVideo.id}>
                        <div
                            className="player__controls-volume"
                            onWheel={handleWheelVolume}
                        >
                            <Button
                                className="player__controls-button icon-button"
                                onClick={toggleMute}
                                icon={
                                    state.volume === 0
                                        ? 'volume-off'
                                        : 'volume-up'
                                }
                                ariaLabel={
                                    state.volume === 0 ? 'Unmute' : 'Mute'
                                }
                            />

                            <VolumeRange
                                value={state.volume}
                                onChange={setVolume}
                            />
                        </div>
                    </Show>

                    <Show
                        when={
                            !isSingleVideo() &&
                            (!availableDevices.length ||
                                !currentDevice.isMaster)
                        }
                    >
                        <Button
                            className={[
                                'player__controls-button badge icon-button',
                                state.isQueueVisible ? 'is-active' : '',
                                storeState.newQueueItems &&
                                !state.isQueueVisible
                                    ? 'badge--active'
                                    : ''
                            ].join(' ')}
                            onClick={toggleQueue}
                            badge={storeState.newQueueItems}
                            icon="list"
                            ariaLabel={
                                state.isQueueVisible
                                    ? 'Close queue'
                                    : 'Open queue'
                            }
                        />
                    </Show>

                    <Show when={!isSingleVideo() && !state.isFullscreen}>
                        <Button
                            className={[
                                'player__controls-button icon-button',
                                state.isScreenVisible ? 'is-active' : ''
                            ].join(' ')}
                            onClick={toggleScreen}
                            icon="screen"
                            ariaLabel={
                                state.isScreenVisible
                                    ? 'Close screen'
                                    : 'open screen'
                            }
                        />
                    </Show>

                    <Show when={isSingleVideo()}>
                        <Button
                            className="player__controls-button icon-button"
                            onClick={handleEditPlaylistItem}
                            icon="folder-add"
                            ariaLabel="Save to playlist"
                        />
                    </Show>

                    <Button
                        className="player__controls-button icon-button"
                        onClick={toggleFullscreen}
                        icon={state.isFullscreen ? 'close' : 'expand'}
                        ariaLabel={
                            state.isFullscreen
                                ? 'Exit Fullscreen'
                                : 'Enable Fullscreen'
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Player;
