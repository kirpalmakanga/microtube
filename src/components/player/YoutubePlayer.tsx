import { useEffect, useRef } from 'react';

import isEqual from 'lodash/isEqual';
import youTubePlayer from 'youtube-player';

const PLAYBACK_STATES = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5
};

const noop = () => {};

const useDeepCompareMemoize = (value) => {
    const ref = useRef();

    if (!isEqual(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
};

const useEffectUpdateOnly = (callback, dependencies) => {
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;

            return;
        }

        callback();
    }, dependencies);
};

const useDeepCompareEffect = (callback, dependencies, updateOnly) =>
    (updateOnly ? useEffectUpdateOnly : useEffect)(callback, [
        useDeepCompareMemoize(dependencies)
    ]);

const filterResetOptions = (opts) => ({
    ...opts,
    playerVars: {
        ...opts.playerVars,
        autoplay: 0,
        start: 0,
        end: 0
    }
});

const YouTube = ({
    id,
    className,
    videoId,
    opts = {},
    onReady = noop,
    onError = noop,
    onBuffering = noop,
    onPlay = noop,
    onPause = noop,
    onEnd = noop,
    onTimeUpdate = noop,
    onLoadingUpdate = noop,
    onStateChange = noop,
    onPlaybackRateChange = noop,
    onPlaybackQualityChange = noop
}) => {
    const { start, end } = opts.playerVars || {};
    const container = useRef(null);
    const internalPlayer = useRef<unknown>(null);
    const currentTime = useRef(0);
    const timeWatcher = useRef(null);
    const currentLoadedPercentage = useRef(0);
    const loadingWatcher = useRef(null);

    const updateTime = async () => {
        const time = await internalPlayer.current.getCurrentTime();

        if (time !== currentTime.current) {
            currentTime.current = time;

            onTimeUpdate(time);
        }
    };

    const watchTime = () => {
        if (timeWatcher.current) {
            return;
        }

        updateTime();

        timeWatcher.current = setInterval(updateTime, 200);
    };

    const updateLoading = async () => {
        const loaded = await internalPlayer.current.getVideoLoadedFraction();

        if (loaded !== currentLoadedPercentage.current) {
            currentLoadedPercentage.current = loaded;

            onLoadingUpdate(loaded);
        }
    };

    const watchLoading = () => {
        if (loadingWatcher.current) {
            return;
        }

        updateLoading();

        loadingWatcher.current = setInterval(updateLoading, 500);
    };

    const handleIframeReady = (youtube) => {
        watchTime();
        watchLoading();

        onReady(youtube);
    };

    const createPlayer = () => {
        if (typeof document === 'undefined' || internalPlayer.current) {
            return;
        }

        const { ENDED, PLAYING, PAUSED, BUFFERING } = PLAYBACK_STATES;

        const events = {
            ready: handleIframeReady,
            error: onError,
            stateChange: (e) => {
                onStateChange(e);

                switch (e.data) {
                    case ENDED:
                        onEnd(e);
                        break;

                    case PLAYING:
                        onPlay(e);
                        break;

                    case PAUSED:
                        onPause(e);
                        break;

                    case BUFFERING:
                        onBuffering(e);
                        break;

                    default:
                        return;
                }
            },
            playbackRateChange: onPlaybackRateChange,
            playbackQualityChange: onPlaybackQualityChange
        };

        try {
            internalPlayer.current = youTubePlayer(container.current, {
                ...opts,
                videoId
            });

            for (const eventKey in events) {
                internalPlayer.current.on(eventKey, events[eventKey]);
            }
        } catch (error) {
            console.error(error);

            onError(error);
        }
    };

    const resetPlayer = async () => {
        await internalPlayer.current.destroy();

        createPlayer();
    };

    const updatePlayer = async () => {
        const iframe = await internalPlayer.current.getIframe();

        iframe.setAttribute('id', id);
    };

    const updateVideo = () => {
        const newOpts = { videoId };
        let autoplay = false;

        if (!videoId) {
            internalPlayer.current.stopVideo();
            return;
        }

        if ('playerVars' in opts) {
            const { playerVars } = opts;

            autoplay = playerVars.autoplay === 1;

            if ('start' in playerVars) {
                newOpts.startSeconds = playerVars.start;
            }
            if ('end' in playerVars) {
                newOpts.endSeconds = playerVars.end;
            }
        }

        if (autoplay) {
            internalPlayer.current.loadVideoById(newOpts);
            return;
        }

        internalPlayer.current.cueVideoById(newOpts);
    };

    const handleUnmounting = () => {
        clearInterval(timeWatcher.current);
        clearInterval(loadingWatcher.current);

        if (internalPlayer.current) {
            internalPlayer.current.destroy();
            internalPlayer.current = null;
        }
    };

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
        filterResetOptions(opts),
        true
    );

    useEffectUpdateOnly(() => {
        updateVideo();
    }, [videoId, start, end]);

    return (
        <div className={className}>
            <div ref={container}></div>
        </div>
    );
};

export default YouTube;
