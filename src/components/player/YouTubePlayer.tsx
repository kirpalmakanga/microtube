import { Component, createEffect, onCleanup, onMount } from 'solid-js';
import {
    createYoutubePlayer,
    Options,
    PLAYBACK_STATES,
    YouTubePlayer
} from '../../api/youtube-player';
import { isEqual } from '../../lib/helpers';

interface Props {
    id?: string;
    className?: string;
    videoId: string;
    options: Options;
    onReady: (playerInstance: YouTubePlayer) => void;
    onError: (error: unknown) => void;
    onBuffering: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnd: () => void;
    onStateChange?: (playbackStateId: number) => void;
}

interface NewOptions {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
}

const noop = () => {};

export const Player: Component<Props> = (props) => {
    const {
        playerVars: { start, end }
    }: any = props.options;

    let internalPlayer: YouTubePlayer;

    const getContainerId = () => props.id || 'youtube-player';

    const handleIframeReady = () => props.onReady(internalPlayer);

    const createPlayer = async () => {
        if (typeof document === 'undefined' || internalPlayer) {
            return;
        }

        const {
            onStateChange = noop,
            onEnd = noop,
            onPlay = noop,
            onPause = noop,
            onBuffering = noop
        } = props;
        const { ENDED, PLAYING, PAUSED, BUFFERING } = PLAYBACK_STATES;

        try {
            internalPlayer = await createYoutubePlayer(getContainerId(), {
                ...props.options,
                videoId: props.videoId,
                events: {
                    onReady: handleIframeReady,
                    onError: props.onError,
                    onStateChange({ data }: { [key: string]: any }) {
                        onStateChange(data);

                        switch (data) {
                            case ENDED:
                                onEnd();
                                break;

                            case PLAYING:
                                onPlay();
                                break;

                            case PAUSED:
                                onPause();
                                break;

                            case BUFFERING:
                                onBuffering();
                                break;

                            default:
                                return;
                        }
                    }
                }
            });
        } catch (error: unknown) {
            console.error(error);

            props.onError(error);
        }
    };

    const destroyPlayer = () => internalPlayer?.destroy();

    const resetPlayer = async () => {
        await destroyPlayer();

        createPlayer();
    };

    const updateVideo = async () => {
        if (!props.videoId) {
            internalPlayer.stopVideo();
            return;
        }

        const newOpts: NewOptions = { videoId: props.videoId };
        let autoplay = false;

        if ('playerVars' in props.options) {
            const { playerVars = {} } = props.options;

            autoplay = playerVars.autoplay === 1;

            if ('start' in playerVars) {
                newOpts.startSeconds = playerVars.start;
            }
            if ('end' in playerVars) {
                newOpts.endSeconds = playerVars.end;
            }
        }

        if (autoplay) {
            await internalPlayer.loadVideoById(newOpts);
        } else {
            await internalPlayer.cueVideoById(newOpts);
        }

        handleIframeReady();
    };

    createEffect((previousOptions) => {
        if (!isEqual(props.options, previousOptions)) resetPlayer();

        return props.options;
    }, props.options);

    createEffect((previousVideoId) => {
        if (props.videoId !== previousVideoId) updateVideo();

        return props.videoId;
    }, props.videoId);

    onMount(createPlayer);

    onCleanup(destroyPlayer);

    return (
        <div className={props.className}>
            <div id={getContainerId()}></div>
        </div>
    );
};
