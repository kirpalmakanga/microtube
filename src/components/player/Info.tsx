import { Component, createEffect, onMount, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

import {
    PlayerSyncPayload,
    PlayerSyncHandlers,
    GenericObject,
    HTMLElementEvent
} from '../../../@types/alltypes';

import InfoTime from './controls/InfoTime';
import InfoProgress from './controls/InfoProgress';
import { preventDefault, setImmediateInterval } from '../../lib/helpers';
import { subscribe, emit } from '../../lib/socket';

interface Props {
    isWatchingDisabled: boolean;
    videoId: string;
    title: string;
    duration: number;
    onStartSeeking: () => void;
    onEndSeeking: (seekingTime: number) => void;
    getCurrentTime: () => number | null;
    getLoadingProgress: () => number | null;
}

const Info: Component<Props> = ({
    isWatchingDisabled,
    videoId,
    title,
    duration,
    getCurrentTime,
    getLoadingProgress,
    onStartSeeking,
    onEndSeeking
}) => {
    let timeWatcher: number | null;
    let loadingWatcher: number | null;

    const [{ loaded, currentTime, seekingTime, isSeeking }, setState] =
        createStore({
            loaded: 0,
            currentTime: 0,
            seekingTime: 0,
            isSeeking: false
        });

    const clearWatchers = () => {
        if (timeWatcher) {
            clearInterval(timeWatcher);
            timeWatcher = null;
        }
        if (loadingWatcher) {
            clearInterval(loadingWatcher);
            loadingWatcher = null;
        }
    };

    const startWatchers = () => {
        clearWatchers();

        timeWatcher = setImmediateInterval(() => {
            const currentTime = getCurrentTime();

            if (currentTime !== null) {
                setState({ currentTime });
            }
        }, 200);

        loadingWatcher = setImmediateInterval(() => {
            const loaded = getLoadingProgress();

            if (loaded !== null) {
                setState({ loaded });
            }
        }, 500);
    };

    const startSeeking = () => {
        onStartSeeking();

        setState({ isSeeking: true });
    };

    const endSeeking = () => {
        setState({ isSeeking: false, currentTime: seekingTime });

        emit('player:sync', {
            action: 'seek-time',
            data: { seekingTime }
        });

        onEndSeeking(seekingTime);
    };

    const handleSeeking = ({
        currentTarget: { value: seekingTime }
    }: HTMLElementEvent<HTMLInputElement>) =>
        setState({ seekingTime: parseInt(seekingTime) });

    const time = isSeeking ? seekingTime : currentTime;

    createEffect(() => {
        setState({ currentTime: 0, loaded: 0, seekingTime: 0 });

        return videoId;
    });

    createEffect(() => {
        if (isWatchingDisabled) {
            clearWatchers();
        } else {
            startWatchers();
        }

        return isWatchingDisabled;
    });

    onMount(() => {
        const actions: PlayerSyncHandlers = {
            'seek-time': ({ seekingTime }: GenericObject) =>
                setState({ seekingTime }),
            'update-time': ({ currentTime }: GenericObject) =>
                setState({ currentTime }),
            'update-loading': ({ loaded }: GenericObject) =>
                setState({ loaded })
        };

        subscribe('player:sync', ({ action, data }: PlayerSyncPayload) => {
            const { [action]: handler } = actions;

            if (handler) {
                handler(data);
            }
        });
    });

    onCleanup(clearWatchers);

    return (
        <div className="PlayerInfo">
            <InfoProgress
                percentElapsed={duration ? time / duration : 0}
                percentLoaded={loaded}
            />

            <div className="PlayerInfo__Title">{title}</div>

            <InfoTime time={time} duration={duration} />

            <label className="sr-only" htmlFor="seek-time">
                Seek time
            </label>

            <input
                id="seek-time"
                className="PlayerInfo__Seek"
                aria-label="Seek time"
                type="range"
                min="0"
                max={duration}
                onWheel={preventDefault()}
                onInput={handleSeeking}
                onMouseDown={startSeeking}
                onMouseUp={endSeeking}
            />
        </div>
    );
};

export default Info;
