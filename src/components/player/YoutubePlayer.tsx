import { FunctionComponent, useCallback, useEffect, useRef } from 'react';

import isEqual from 'lodash/isEqual';
import youTubePlayer from 'youtube-player';
import type { YouTubePlayer, Options } from 'youtube-player/dist/types';
import EVENT_NAMES, { EventType } from 'youtube-player/dist/eventNames';

const PLAYBACK_STATES = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
};
interface Props {
    id?: string;
    className?: string;
    videoId: string;
    options: Options;
    onReady: (playerInstance: YouTubePlayer) => void;
    onError: (error: object) => void;
    onBuffering: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnd: () => void;
    onTimeUpdate: (t: number | undefined) => void;
    onLoadingUpdate: (t: number | undefined) => void;
    onStateChange: (playbackStateId: number) => void;
    // onPlaybackRateChange?: (data: any) => void,
    // onPlaybackQualityChange:(data: any) => void
}

interface NewOptions {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
}

const useDeepCompareMemoize = (value: any) => {
    const ref = useRef();

    if (!isEqual(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
};

const useEffectUpdateOnly = (callback: () => void, dependencies: any) => {
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;

            return;
        }

        callback();
    }, dependencies);
};

const useDeepCompareEffect = (
    callback: () => void,
    dependencies: any,
    updateOnly: boolean
) =>
    (updateOnly ? useEffectUpdateOnly : useEffect)(callback, [
        useDeepCompareMemoize(dependencies),
    ]);

const filterResetOptions = (options: Options) => ({
    ...options,
    playerVars: {
        ...options.playerVars,
        autoplay: 0,
        start: 0,
        end: 0,
    },
});

export { Options };

export const YoutubePlayer: FunctionComponent<Props> = ({
    id = 'youtube-player',
    className,
    videoId,
    options,
    onReady,
    onError,
    onBuffering,
    onPlay = () => {},
    onPause = () => {},
    onEnd,
    onTimeUpdate,
    onLoadingUpdate,
    onStateChange,
    // onPlaybackRateChange = noop,
    // onPlaybackQualityChange = noop
}) => {
    const {
        playerVars: { start, end },
    }: any = options;
    const internalPlayer = useRef<YouTubePlayer | null>(null);
    const currentTime = useRef<number | undefined>(0);
    const timeWatcher = useRef<number>();
    const currentLoadedPercentage = useRef<number | undefined>(0);
    const loadingWatcher = useRef<number>();

    const updateTime = useCallback(async () => {
        const time = await internalPlayer.current?.getCurrentTime();

        if (time !== currentTime.current) {
            currentTime.current = time;

            onTimeUpdate(time);
        }
    }, []);

    const watchTime = useCallback(() => {
        if (timeWatcher.current) {
            return;
        }

        updateTime();

        timeWatcher.current = window.setInterval(updateTime, 200);
    }, []);

    const updateLoading = useCallback(async () => {
        const loaded = await internalPlayer.current?.getVideoLoadedFraction();

        if (loaded !== currentLoadedPercentage.current) {
            currentLoadedPercentage.current = loaded;

            onLoadingUpdate(loaded);
        }
    }, []);

    const watchLoading = useCallback(() => {
        if (loadingWatcher.current) {
            return;
        }

        updateLoading();

        loadingWatcher.current = window.setInterval(updateLoading, 500);
    }, []);

    const handleIframeReady = useCallback(({ target }) => {
        watchTime();
        watchLoading();

        onReady(target);
    }, []);

    const createPlayer = useCallback(() => {
        if (typeof document === 'undefined' || internalPlayer.current) {
            return;
        }

        const [READY, STATE_CHANGE, , , ERROR] = EVENT_NAMES;
        const { ENDED, PLAYING, PAUSED, BUFFERING } = PLAYBACK_STATES;

        const events = {
            [READY]: handleIframeReady,
            [ERROR]: onError,
            [STATE_CHANGE]: ({ data }: { [key: string]: any }) => {
                /* TODO: use correct typing */
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
            },
            // playbackRateChange: onPlaybackRateChange,
            // playbackQualityChange: onPlaybackQualityChange
        };

        try {
            internalPlayer.current = youTubePlayer(id, {
                ...options,
                videoId,
            });

            for (const [eventKey, event] of Object.entries(events)) {
                internalPlayer.current?.on(eventKey as EventType, event);
            }
        } catch (error) {
            console.error(error);

            onError(error);
        }
    }, []);

    const resetPlayer = useCallback(async () => {
        await internalPlayer.current?.destroy();

        createPlayer();
    }, []);

    const updatePlayer = useCallback(async () => {
        const iframe = await internalPlayer.current?.getIframe();

        if (id) {
            iframe?.setAttribute('id', id);
        }
    }, []);

    const updateVideo = useCallback(() => {
        const newOpts: NewOptions = { videoId };
        let autoplay = false;

        if (!videoId) {
            internalPlayer.current?.stopVideo();
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
            internalPlayer.current?.loadVideoById(newOpts);
            return;
        }

        internalPlayer.current?.cueVideoById(newOpts);
    }, [videoId]);

    const handleUnmounting = useCallback(() => {
        window.clearInterval(timeWatcher.current);
        window.clearInterval(loadingWatcher.current);

        if (internalPlayer.current) {
            internalPlayer.current?.destroy();
            internalPlayer.current = null;
        }
    }, []);

    useEffect(() => {
        createPlayer();

        onTimeUpdate(0);
        onLoadingUpdate(0);

        return handleUnmounting;
    }, []);

    useEffectUpdateOnly(() => {
        updatePlayer();
    }, [id, className]);

    useDeepCompareEffect(
        () => {
            resetPlayer();
        },
        filterResetOptions(options),
        true
    );

    useEffectUpdateOnly(() => {
        updateVideo();
    }, [videoId, start, end]);

    return (
        <div className={className}>
            <div id={id}></div>
        </div>
    );
};
