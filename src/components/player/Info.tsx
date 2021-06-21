import {
    memo,
    useRef,
    useEffect,
    FunctionComponent,
    SyntheticEvent
} from 'react';

import {
    PlayerSyncPayload,
    PlayerSyncHandlers,
    GenericObject
} from '../../../@types/alltypes';

import InfoTime from './controls/InfoTime';
import InfoProgress from './controls/InfoProgress';
import { preventDefault, setImmediateInterval } from '../../lib/helpers';
import { useMergedState, useUpdateEffect } from '../../lib/hooks';
import { subscribe, emit } from '../../lib/socket';

interface Props {
    isWatchingDisabled: boolean;
    title: string;
    duration: number;
    onStartSeeking: () => void;
    onEndSeeking: (seekingTime: number) => void;
    getCurrentTime: () => number | null;
    getLoadingProgress: () => number | null;
}

const Info: FunctionComponent<Props> = ({
    isWatchingDisabled,
    title,
    duration,
    getCurrentTime,
    getLoadingProgress,
    onStartSeeking,
    onEndSeeking
}) => {
    const timeWatcher = useRef<number | null>(null);
    const loadingWatcher = useRef<number | null>(null);
    const [{ loaded, currentTime, seekingTime, isSeeking }, setState] =
        useMergedState({
            loaded: 0,
            currentTime: 0,
            seekingTime: 0,
            isSeeking: false
        });

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
    }: SyntheticEvent<HTMLInputElement>) =>
        setState({ seekingTime: parseInt(seekingTime) });

    const startWatchers = () => {
        timeWatcher.current = setImmediateInterval(() => {
            const currentTime = getCurrentTime();

            if (currentTime !== null) {
                setState({ currentTime });
            }
        }, 200);

        loadingWatcher.current = setImmediateInterval(() => {
            const loaded = getLoadingProgress();

            if (loaded !== null) {
                setState({ loaded });
            }
        }, 500);
    };

    const clearWatchers = () => {
        if (timeWatcher.current) clearInterval(timeWatcher.current);
        if (loadingWatcher.current) clearInterval(loadingWatcher.current);
    };

    const time = isSeeking ? seekingTime : currentTime;

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (isWatchingDisabled) {
            clearWatchers();
        } else {
            timeWatcher.current = setImmediateInterval(() => {
                const currentTime = getCurrentTime();

                if (currentTime !== null) {
                    setState({ currentTime });
                }
            }, 200);

            loadingWatcher.current = setImmediateInterval(() => {
                startWatchers();
            }, 500);
        }

        return () => {
            clearWatchers();
        };
    }, [isWatchingDisabled]);

    useUpdateEffect(() => {
        if (!isSeeking) {
            onEndSeeking(seekingTime);
        }
    }, [isSeeking, seekingTime]);

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

export default memo(Info);
