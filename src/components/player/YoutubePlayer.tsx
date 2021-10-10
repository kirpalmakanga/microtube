import { onMount, onCleanup, Component, createEffect } from 'solid-js';
import youTubePlayer from 'youtube-player';
import type { YouTubePlayer, Options } from 'youtube-player/dist/types';
import EVENT_NAMES, { EventType } from 'youtube-player/dist/eventNames';
import { isEqual } from 'lodash';

const PLAYBACK_STATES = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5
};
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

const filterResetOptions = (options: Options) => ({
    ...options,
    playerVars: {
        ...options.playerVars,
        autoplay: 0,
        start: 0,
        end: 0
    }
});

export { Options };

export const YoutubePlayer: Component<Props> = ({
    id = 'youtube-player',
    className,
    videoId,
    options,
    onReady,
    onError = () => {},
    onBuffering,
    onPlay = () => {},
    onPause = () => {},
    onEnd,
    onStateChange = () => {}
}) => {
    const {
        playerVars: { start, end }
    }: any = options;

    let internalPlayer: YouTubePlayer;

    const handleIframeReady = () => onReady(internalPlayer);
    const createPlayer = () => {
        if (typeof document === 'undefined' || internalPlayer) {
            return;
        }

        const [READY, STATE_CHANGE, , , ERROR] = EVENT_NAMES;
        const { ENDED, PLAYING, PAUSED, BUFFERING } = PLAYBACK_STATES;

        const events = {
            [READY]: handleIframeReady,
            [ERROR]: onError,
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
            internalPlayer = youTubePlayer(id, {
                ...options,
                videoId
            });

            for (const [eventKey, event] of Object.entries(events)) {
                internalPlayer.on(eventKey as EventType, event);
            }
        } catch (error: unknown) {
            console.error(error);

            onError(error);
        }
    };

    const resetPlayer = async () => {
        await internalPlayer.destroy();

        createPlayer();
    };

    const updateVideo = () => {
        const newOpts: NewOptions = { videoId };
        let autoplay = false;

        if (!videoId) {
            internalPlayer.stopVideo();
            return;
        }

        if ('playerVars' in options) {
            const { playerVars = {} } = options;

            autoplay = playerVars.autoplay === 1;

            if ('start' in playerVars) {
                newOpts.startSeconds = playerVars.start;
            }
            if ('end' in playerVars) {
                newOpts.endSeconds = playerVars.end;
            }
        }

        if (autoplay) {
            internalPlayer.loadVideoById(newOpts);
            return;
        }

        internalPlayer.cueVideoById(newOpts);
    };

    createEffect((previousOptions) => {
        if (!isEqual(options, previousOptions)) resetPlayer();

        return options;
    }, options);

    createEffect((previousVideoId) => {
        if (videoId !== previousVideoId) updateVideo();

        return videoId;
    }, videoId);

    /* TODO: review all creatEffect calls */

    onMount(createPlayer);

    return (
        <div className={className}>
            <div id={id}></div>
        </div>
    );
};
