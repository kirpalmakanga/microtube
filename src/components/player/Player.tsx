import { createEffect, onMount, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Transition } from 'solid-transition-group';
import { isMobile } from '../../lib/helpers';
import { useFullscreen, useKey } from '../../lib/hooks';
import { usePlayer } from '../../store/player';
import { usePlaylistItems } from '../../store/playlist-items';
import {
    YoutubePlaybackState,
    YouTubePlayerInstance
} from '../../api/youtube-player';
import VolumeRange from './controls/VolumeRange';
import Info from './Info';
import Queue from './Queue';
import Screen from './Screen';
import Description from './Description';
import IconButton from '../IconButton';

interface PlayerInnerState {
    isPlaying: boolean;
    isBuffering: boolean;
    isMuted: boolean;
    isQueueVisible: boolean;
    isScreenVisible: boolean;
    isDescriptionVisible: boolean;
    volume: number;
}

const getInitialPlayerState = () => ({
    isPlaying: false,
    isBuffering: false,
    isMuted: false,
    isQueueVisible: false,
    isScreenVisible: false,
    isDescriptionVisible: false,
    volume: 100
});

const Player = () => {
    let isStartup: boolean = true;
    let youtube: YouTubePlayerInstance | null;
    let youtubeVolume: number = 100;

    const [state, setPlayerState] = createStore<PlayerInnerState>(
        getInitialPlayerState()
    );

    const [
        storeState,
        { goToNextQueueItem, clearNewQueueItems, setScreenVisibility }
    ] = usePlayer();

    const [, { editPlaylistItem }] = usePlaylistItems();

    const { isFullscreen, fullscreenRef, enterFullscreen, exitFullscreen } =
        useFullscreen();

    function isSingleVideo() {
        return !!storeState.video.id;
    }

    function hasCurrentVideo() {
        return !!storeState.currentVideo.id;
    }

    function handleEditPlaylistItem() {
        editPlaylistItem(storeState.currentVideo);
    }

    function toggleFullscreen() {
        if (isFullscreen()) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }

    function setVolume(volume: number) {
        setPlayerState({ volume });
    }

    function toggleMute() {
        setPlayerState({ isMuted: !state.isMuted });
    }

    function goToVideo(next: boolean | undefined = true) {
        goToNextQueueItem(next);
    }

    function toggleScreen() {
        const isScreenVisible = !state.isScreenVisible;

        setPlayerState({
            isScreenVisible,
            ...(isScreenVisible
                ? { isQueueVisible: false, isDescriptionVisible: false }
                : {})
        });

        setScreenVisibility(isScreenVisible);
    }

    function toggleQueue() {
        const isQueueVisible = !state.isQueueVisible;

        setPlayerState({
            isQueueVisible,
            ...(isQueueVisible
                ? { isScreenVisible: false, isDescriptionVisible: false }
                : {})
        });

        if (isQueueVisible) clearNewQueueItems();
    }

    function toggleInfo() {
        const isVisible = !state.isDescriptionVisible;

        setPlayerState({
            isDescriptionVisible: isVisible,
            ...(isVisible
                ? { isScreenVisible: false, isQueueVisible: false }
                : {})
        });
    }

    function handleYoutubeIframeReady(playerInstance: YouTubePlayerInstance) {
        youtube = playerInstance;
    }

    function handleYoutubeIframeStateChange(
        playbackStateId: YoutubePlaybackState
    ) {
        switch (playbackStateId) {
            case YoutubePlaybackState.UNSTARTED:
                if (!isStartup) {
                    setPlayerState({
                        isPlaying: true,
                        isBuffering: false
                    });
                } else {
                    isStartup = false;
                }
                break;
        }
    }

    function handlePlay() {
        setPlayerState({
            isPlaying: true,
            isBuffering: false
        });
    }

    function handlePause() {
        setPlayerState({
            isPlaying: false,
            isBuffering: false
        });
    }

    function handleSeeking(currentTime: number) {
        youtube?.seekTo(currentTime, true);

        handlePlay();
    }

    function handleBuffering() {
        setPlayerState({ isBuffering: true });
    }

    function togglePlay() {
        if (storeState.currentVideo.id) {
            setPlayerState({
                isPlaying: !state.isPlaying,
                isBuffering: false
            });
        }
    }

    async function getCurrentTime() {
        if (youtube) {
            return await youtube.getCurrentTime();
        }

        return null;
    }

    async function getLoadingProgress() {
        if (youtube) {
            return await youtube.getVideoLoadedFraction();
        }

        return null;
    }

    function handleWheelVolume({ deltaY }: HTMLElementWheelEvent) {
        const newVolume = state.volume + (deltaY < 0 ? 5 : -5);
        const inRange = newVolume >= 0 && newVolume <= 100;

        if (inRange) {
            setVolume(newVolume);
        }
    }

    function handleVideoEnd() {
        if (!isSingleVideo()) {
            goToVideo();
        }
    }

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
        const {
            currentVideo: { id: videoId }
        } = storeState;

        if (!videoId) {
            youtube = null;

            setPlayerState(getInitialPlayerState());
        }

        return videoId;
    }, storeState.currentVideo.id);

    onMount(() => {
        fullscreenRef(document.body);
    });

    return (
        <div
            class="flex flex-col justify-end shadow z-3"
            classList={{
                'fixed inset-0 bg-primary-900': isFullscreen()
            }}
            data-state-show-queue={
                state.isQueueVisible ? 'enabled' : 'disabled'
            }
        >
            <Screen
                isVisible={
                    isSingleVideo() || state.isScreenVisible || isFullscreen()
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

            <div class="relative bg-primary-900 shadow">
                <div class="flex <sm:flex-wrap shadow">
                    <div class="flex items-center px-4 gap-2">
                        <Show when={!isSingleVideo()}>
                            <IconButton
                                onClick={() => goToVideo(false)}
                                icon="chevron-left"
                                disabled={!hasCurrentVideo()}
                            />
                        </Show>

                        <IconButton
                            onClick={togglePlay}
                            icon={state.isPlaying ? 'pause' : 'play'}
                            disabled={!hasCurrentVideo()}
                        />

                        <Show when={!isSingleVideo()}>
                            <IconButton
                                onClick={() => goToVideo(true)}
                                icon="chevron-right"
                                disabled={!hasCurrentVideo()}
                            />
                        </Show>
                    </div>

                    <Info
                        isWatchingDisabled={
                            state.isBuffering || !state.isPlaying
                        }
                        videoId={storeState.currentVideo.id}
                        title={storeState.currentVideo.title}
                        duration={storeState.currentVideo.duration}
                        getCurrentTime={getCurrentTime}
                        getLoadingProgress={getLoadingProgress}
                        onStartSeeking={handlePause}
                        onEndSeeking={handleSeeking}
                    />

                    <div class="flex items-center px-4 gap-2">
                        <Show when={!isMobile() && storeState.currentVideo.id}>
                            <div
                                class="relative group"
                                onWheel={handleWheelVolume}
                            >
                                <IconButton
                                    onClick={toggleMute}
                                    icon={
                                        state.volume === 0
                                            ? 'volume-off'
                                            : 'volume-up'
                                    }
                                />

                                <div class="absolute bottom-full right-0 w-36 transition-opacity opacity-0 invisible group-hover:(opacity-100 visible)">
                                    <VolumeRange
                                        value={state.volume}
                                        onChange={setVolume}
                                    />
                                </div>
                            </div>
                        </Show>

                        <Show when={hasCurrentVideo() || isSingleVideo()}>
                            <IconButton
                                isActive={state.isDescriptionVisible}
                                icon="info"
                                onClick={toggleInfo}
                            />
                        </Show>

                        <Show when={!isSingleVideo()}>
                            <IconButton
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

                        <Show
                            when={
                                hasCurrentVideo() &&
                                !isSingleVideo() &&
                                !isFullscreen()
                            }
                        >
                            <IconButton
                                isActive={state.isScreenVisible}
                                onClick={toggleScreen}
                                icon="screen"
                            />
                        </Show>

                        <Show when={isSingleVideo()}>
                            <IconButton
                                onClick={handleEditPlaylistItem}
                                icon="folder-add"
                            />
                        </Show>

                        <Show when={hasCurrentVideo()}>
                            <IconButton
                                onClick={toggleFullscreen}
                                icon={isFullscreen() ? 'minimize' : 'expand'}
                            />
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player;
