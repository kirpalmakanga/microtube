import { memo, useEffect, FunctionComponent, SyntheticEvent } from 'react';

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
    title: string;
    duration: number;
    onStartSeeking: () => void;
    onEndSeeking: (seekingTime: number) => void;
    getCurrentTime: () => number | null;
    getLoadingProgress: () => number | null;
}

const Info: FunctionComponent<Props> = ({
    title,
    duration,
    getCurrentTime,
    getLoadingProgress,
    onStartSeeking,
    onEndSeeking
}) => {
    const [
        { loaded, currentTime, seekingTime, isSeeking },
        setState
    ] = useMergedState({
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
        const timeWatcher = setImmediateInterval(() => {
            const currentTime = getCurrentTime();

            if (currentTime !== null) {
                setState({ currentTime });
            }
        }, 200);

        const loadingWatcher = setImmediateInterval(() => {
            const loaded = getLoadingProgress();

            if (loaded !== null) {
                setState({ loaded });
            }
        }, 500);

        return () => {
            clearInterval(timeWatcher);
            clearInterval(loadingWatcher);
        };
    }, []);

    useUpdateEffect(() => {
        if (!isSeeking) {
            onEndSeeking(seekingTime);
        }
    }, [isSeeking, seekingTime]);

    return (
        <div className="player__info">
            <InfoProgress
                percentElapsed={duration ? time / duration : 0}
                percentLoaded={loaded}
            />

            <div className="player__info-title">{title}</div>

            <InfoTime time={time} duration={duration} />

            <label className="sr-only" htmlFor="seek-time">
                Seek time
            </label>

            <input
                aria-label="Seek time"
                id="seek-time"
                className="player__info-progress-loaded"
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
