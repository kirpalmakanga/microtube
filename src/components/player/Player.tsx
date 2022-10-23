import { createEffect, createMemo, onCleanup, onMount, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Transition } from 'solid-transition-group';
import { isMobile } from '../../lib/helpers';
import { useFullscreen, useKey } from '../../lib/hooks';
import { useDevices } from '../../store/app';
import { usePlayer } from '../../store/player';
import { usePlaylistItems } from '../../store/playlist-items';
import { YouTubePlayer } from '../../api/youtube-player';

import Button from './controls/Button';
import DevicesSelector from './controls/DevicesSelector';
import VolumeRange from './controls/VolumeRange';
import Info from './Info';
import Queue from './Queue';
import Screen from './Screen';
import Description from './Description';

const UNSTARTED = -1;

interface PlayerInnerState {
    isFullscreen: boolean;
    isPlaying: boolean;
    isBuffering: boolean;
    isMuted: boolean;
    isQueueVisible: boolean;
    isScreenVisible: boolean;
    isDevicesSelectorVisible: boolean;
    isDescriptionVisible: boolean;
    volume: number;
}

const getInitialState = () => ({
    isFullscreen: false,
    isPlaying: false,
    isBuffering: false,
    isMuted: false,
    isQueueVisible: false,
    isScreenVisible: false,
    isDevicesSelectorVisible: false,
    isDescriptionVisible: false,
    volume: 100
});

const Player = () => {
    let isStartup: boolean = true;
    let youtube: YouTubePlayer | null;
    let youtubeVolume: number = 100;
    let unsubscribeFromFullscreen: () => void;

    const [state, setPlayerState] = createStore<PlayerInnerState>(
        getInitialState()
    );

    const [
        storeState,
        { goToNextQueueItem, clearNewQueueItems, setScreenVisibility }
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
        editPlaylistItem(storeState.currentVideo);

    const setSyncedPlayerState = (data: GenericObject) => {
        setPlayerState(data);

        synchronizePlayer({
            action: 'update-state',
            data
        });
    };

    const toggleFullscreen = () =>
        setSyncedPlayerState({ isFullscreen: !state.isFullscreen });

    const setVolume = (volume: number) => setSyncedPlayerState({ volume });

    const toggleMute = () => setSyncedPlayerState({ isMuted: !state.isMuted });

    const goToVideo = (next: boolean | undefined = true) =>
        goToNextQueueItem(next);

    const toggleScreen = () => {
        const isScreenVisible = !state.isScreenVisible;

        setSyncedPlayerState({
            isScreenVisible,
            ...(isScreenVisible && !availableDevices.length
                ? { isQueueVisible: false, isDescriptionVisible: false }
                : {})
        });

        setScreenVisibility(isScreenVisible);
    };

    const toggleQueue = () => {
        const isQueueVisible = !state.isQueueVisible;

        setPlayerState({
            isQueueVisible,
            ...(isQueueVisible && !availableDevices.length
                ? { isScreenVisible: false, isDescriptionVisible: false }
                : {})
        });

        if (isQueueVisible) clearNewQueueItems();
    };

    const toggleInfo = () => {
        const isVisible = !state.isDescriptionVisible;

        setPlayerState({
            isDescriptionVisible: isVisible,
            ...(isVisible
                ? { isScreenVisible: false, isQueueVisible: false }
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
                    setSyncedPlayerState({
                        isPlaying: true,
                        isBuffering: false
                    });
                } else {
                    isStartup = false;
                }
                break;
        }
    };

    const handlePlay = () =>
        setSyncedPlayerState({
            isPlaying: true,
            isBuffering: false
        });

    const handlePause = () =>
        setSyncedPlayerState({
            isPlaying: false,
            isBuffering: false
        });

    const handleSeeking = (currentTime: number) => {
        youtube?.seekTo(currentTime, true);

        handlePlay();
    };

    const handleBuffering = () => setSyncedPlayerState({ isBuffering: true });

    const togglePlay = () => {
        if (storeState.currentVideo.id)
            setSyncedPlayerState({
                isPlaying: !state.isPlaying,
                isBuffering: false
            });
    };

    const getCurrentTime = async () => {
        if (youtube) {
            const currentTime = await youtube.getCurrentTime();

            synchronizePlayer({
                action: 'update-time',
                data: { currentTime }
            });

            return currentTime;
        }

        return null;
    };

    const getLoadingProgress = async () => {
        if (youtube) {
            const loaded = await youtube.getVideoLoadedFraction();

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

    useKey('keypress', 'ArrowLeft', () => goToVideo(false));
    useKey('keypress', 'ArrowRight', () => goToVideo(true));
    useKey('keypress', 'm', toggleMute);
    useKey('keypress', 's', toggleScreen);
    useKey('keypress', ' ', togglePlay);

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

    createEffect((previousValue) => {
        const { isPlaying } = state;

        if (isPlaying === previousValue) return previousValue;

        if (isPlaying) youtube?.playVideo();
        else youtube?.pauseVideo();

        return isPlaying;
    }, state.isPlaying);

    createEffect(() => {
        if (currentDevice().isMaster) {
            setPlayerState({ isScreenVisible: state.isScreenVisible });
        }

        return [currentDevice().isMaster, state.isScreenVisible];
    }, [currentDevice().isMaster, state.isScreenVisible]);

    createEffect(() => {
        if (!currentDevice().isMaster) {
            return;
        }

        if (state.isFullscreen) {
            requestFullscreen();
        } else {
            exitFullscreen();
        }

        return [currentDevice().isMaster, state.isFullscreen];
    }, [currentDevice().isMaster, state.isFullscreen]);

    createEffect(() => {
        const {
            currentVideo: { id: videoId }
        } = storeState;

        if (!videoId) {
            youtube = null;

            setPlayerState(getInitialState());
        }

        return videoId;
    }, storeState.currentVideo.id);

    createEffect(
        () => setPlayerState({ isScreenVisible: storeState.isScreenVisible }),
        storeState.isScreenVisible
    );

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
            (isFullscreen: boolean) => setSyncedPlayerState({ isFullscreen })
        );
    });

    onCleanup(() => unsubscribeFromFullscreen());

    const isFullscreen = createMemo(
        () => state.isFullscreen && currentDevice().isMaster
    );

    return (
        <div
            class="flex flex-col justify-end shadow z-1"
            classList={{
                'fixed inset-0 bg-primary-900 z-2': isFullscreen()
            }}
            ref={setFullscreenRef}
            data-state-show-queue={
                state.isQueueVisible ? 'enabled' : 'disabled'
            }
        >
            <Show when={currentDevice().isMaster}>
                <Screen
                    isVisible={
                        isSingleVideo() ||
                        state.isScreenVisible ||
                        isFullscreen()
                    }
                    isFullscreen={isFullscreen()}
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

            <Queue
                isVisible={state.isQueueVisible}
                isPlaying={state.isPlaying}
                isBuffering={state.isBuffering}
                toggleQueue={toggleQueue}
                togglePlay={togglePlay}
            />

            <Transition name="slide-up">
                <Show when={state.isDescriptionVisible}>
                    <Description text={storeState.currentVideo.description} />
                </Show>
            </Transition>

            <Transition name="slide-up">
                <Show
                    when={
                        state.isDevicesSelectorVisible &&
                        availableDevices().length &&
                        !isSingleVideo()
                    }
                >
                    <DevicesSelector
                        currentDevice={currentDevice()}
                        devices={availableDevices()}
                        onClickItem={handleSelectDevice}
                    />
                </Show>
            </Transition>

            <div class="relative bg-primary-900 shadow">
                <div class="flex <sm:flex-wrap shadow">
                    <Show when={!isSingleVideo()}>
                        <Button
                            onClick={() => goToVideo(false)}
                            icon="chevron-left"
                        />
                    </Show>

                    <Button
                        onClick={togglePlay}
                        icon={
                            state.isBuffering
                                ? 'loading'
                                : state.isPlaying
                                ? 'pause'
                                : 'play'
                        }
                    />

                    <Show when={!isSingleVideo()}>
                        <Button
                            onClick={() => goToVideo(true)}
                            icon="chevron-right"
                        />
                    </Show>

                    <Info
                        isWatchingDisabled={
                            state.isBuffering ||
                            !state.isPlaying ||
                            !currentDevice().isMaster
                        }
                        videoId={storeState.currentVideo.id}
                        title={storeState.currentVideo.title}
                        duration={storeState.currentVideo.duration}
                        getCurrentTime={getCurrentTime}
                        getLoadingProgress={getLoadingProgress}
                        onStartSeeking={handlePause}
                        onEndSeeking={handleSeeking}
                    />

                    <Show when={availableDevices().length && !isSingleVideo()}>
                        <Button
                            isActive={state.isDevicesSelectorVisible}
                            icon="devices"
                            onClick={handleToggleDevices}
                        />
                    </Show>

                    <Show when={!isMobile() && storeState.currentVideo.id}>
                        <div class="relative group" onWheel={handleWheelVolume}>
                            <Button
                                onClick={toggleMute}
                                icon={
                                    state.volume === 0
                                        ? 'volume-off'
                                        : 'volume-up'
                                }
                            />

                            <div class="absolute bottom-full right-0 w-36 opacity-0 invisible group-hover:(opacity-100 visible)">
                                <VolumeRange
                                    value={state.volume}
                                    onChange={setVolume}
                                />
                            </div>
                        </div>
                    </Show>

                    <Button
                        isActive={state.isDescriptionVisible}
                        icon="info"
                        onClick={toggleInfo}
                    />

                    <Show
                        when={
                            !isSingleVideo() &&
                            (!availableDevices().length ||
                                !currentDevice().isMaster)
                        }
                    >
                        <Button
                            isActive={state.isQueueVisible}
                            classList={{
                                'badge--active':
                                    !!storeState.newQueueItems &&
                                    !state.isQueueVisible
                            }}
                            onClick={toggleQueue}
                            badge={storeState.newQueueItems}
                            icon="list"
                        />
                    </Show>

                    <Show when={!isSingleVideo() && !state.isFullscreen}>
                        <Button
                            isActive={state.isScreenVisible}
                            onClick={toggleScreen}
                            icon="screen"
                        />
                    </Show>

                    <Show when={isSingleVideo()}>
                        <Button
                            onClick={handleEditPlaylistItem}
                            icon="folder-add"
                        />
                    </Show>

                    <Show when={storeState.currentVideo.id}>
                        <Button
                            onClick={toggleFullscreen}
                            icon={state.isFullscreen ? 'close' : 'expand'}
                        />
                    </Show>
                </div>
            </div>
        </div>
    );
};

export default Player;
