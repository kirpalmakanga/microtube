import { Component, createEffect, JSX, onCleanup, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import {
    GenericObject,
    PlayerSyncHandlers,
    PlayerSyncPayload
} from '../../../@types/alltypes';
import { preventDefault, setImmediateInterval } from '../../lib/helpers';
import { emit, subscribe } from '../../lib/socket';
import InfoProgress from './controls/InfoProgress';
import InfoTime from './controls/InfoTime';

interface Props {
    isWatchingDisabled: boolean;
    videoId: string;
    title: string;
    duration: number;
    onStartSeeking: () => void;
    onEndSeeking: (seekingTime: number) => void;
    getCurrentTime: () => Promise<number | null>;
    getLoadingProgress: () => Promise<number | null>;
}

const Info: Component<Props> = (props) => {
    let timeWatcher: number | null;
    let loadingWatcher: number | null;

    const [state, setState] = createStore({
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

        timeWatcher = setImmediateInterval(async () => {
            const currentTime = await props.getCurrentTime();

            if (currentTime !== null) {
                setState({ currentTime });
            }
        }, 200);

        loadingWatcher = setImmediateInterval(async () => {
            const loaded = await props.getLoadingProgress();

            if (loaded !== null) {
                setState({ loaded });
            }
        }, 500);
    };

    const startSeeking = () => {
        props.onStartSeeking();

        setState({ isSeeking: true });
    };

    const endSeeking = () => {
        const { seekingTime } = state;

        setState({ isSeeking: false, currentTime: seekingTime });

        emit('player:sync', {
            action: 'seek-time',
            data: { seekingTime }
        });

        props.onEndSeeking(seekingTime);
    };

    const handleSeeking: JSX.EventHandler<HTMLInputElement, Event> = ({
        currentTarget: { value: seekingTime }
    }) => setState({ seekingTime: parseInt(seekingTime) });

    const time = () =>
        state.isSeeking ? state.seekingTime : state.currentTime;

    createEffect(() => {
        setState({ currentTime: 0, loaded: 0, seekingTime: 0 });

        return props.videoId;
    }, props.videoId);

    createEffect((previousIsWatchingDisabled) => {
        if (props.isWatchingDisabled === previousIsWatchingDisabled)
            return previousIsWatchingDisabled;

        if (props.isWatchingDisabled) {
            clearWatchers();
        } else {
            startWatchers();
        }

        return props.isWatchingDisabled;
    }, props.isWatchingDisabled);

    onMount(() => {
        const actions: PlayerSyncHandlers = {
            'seek-time': ({ seekingTime }: GenericObject) => {
                setState({ seekingTime });

                props.onEndSeeking(seekingTime);
            },
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
                percentElapsed={props.duration ? time() / props.duration : 0}
                percentLoaded={state.loaded}
            />

            <div className="PlayerInfo__Title">{props.title}</div>

            <InfoTime time={time()} duration={props.duration} />

            <label className="sr-only" htmlFor="seek-time">
                Seek time
            </label>

            <input
                id="seek-time"
                className="PlayerInfo__Seek"
                aria-label="Seek time"
                type="range"
                min="0"
                max={props.duration}
                onWheel={preventDefault()}
                onInput={handleSeeking}
                onMouseDown={startSeeking}
                onMouseUp={endSeeking}
            />
        </div>
    );
};

export default Info;
