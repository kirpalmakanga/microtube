import { onMount, onCleanup, Component, createEffect } from 'solid-js';
import youTubePlayer from 'youtube-player';
import type { YouTubePlayer, Options } from 'youtube-player/dist/types';
import EVENT_NAMES, { EventType } from 'youtube-player/dist/eventNames';
import { isEqual } from 'lodash';

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

const PLAYBACK_STATES = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5
};

const noop = () => {};

interface NewOptions {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
}

export { Options };

export const YoutubePlayer: Component<Props> = (props) => {
    const {
        playerVars: { start, end }
    }: any = props.options;

    let internalPlayer: YouTubePlayer;

    const getContainerId = () => props.id || 'youtube-player';

    const handleIframeReady = () => props.onReady(internalPlayer);

    const createPlayer = () => {
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
        const [READY, STATE_CHANGE, , , ERROR] = EVENT_NAMES;
        const { ENDED, PLAYING, PAUSED, BUFFERING } = PLAYBACK_STATES;

        const events = {
            [READY]: handleIframeReady,
            [ERROR]: props.onError,
            [STATE_CHANGE]: ({ data }: { [key: string]: any }) => {
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
        };

        try {
            internalPlayer = youTubePlayer(getContainerId(), {
                ...props.options,
                videoId: props.videoId
            });

            for (const [eventKey, event] of Object.entries(events)) {
                internalPlayer.on(eventKey as EventType, event);
            }
        } catch (error: unknown) {
            console.error(error);

            props.onError(error);
        }
    };

    const resetPlayer = async () => {
        await internalPlayer.destroy();

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

    return (
        <div className={props.className}>
            <div id={getContainerId()}></div>
        </div>
    );
};
