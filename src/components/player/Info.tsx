import { memo, useState, useCallback, FunctionComponent } from 'react';
import { preventDefault } from '../../lib/helpers';

import InfoTime from './controls/InfoTime';
import InfoProgress from './controls/InfoProgress';

interface Props {
    title: string;
    currentTime: number;
    duration: number;
    loaded: number;
    onStartSeeking: Function;
    onEndSeeking: Function;
}

const noop = () => {};

const Info: FunctionComponent<Props> = ({
    title = '',
    currentTime = 0,
    duration = 0,
    loaded = 0,
    onStartSeeking = noop,
    onEndSeeking = noop
}) => {
    const [seekingTime, setSeekingTime] = useState(currentTime);
    const [isSeeking, setIsSeeking] = useState(false);

    const startSeeking = useCallback(() => {
        onStartSeeking();

        setIsSeeking(true);
    }, []);

    const endSeeking = useCallback(() => {
        setIsSeeking(false);

        if (seekingTime !== currentTime) {
            onEndSeeking(seekingTime);
        }
    }, []);

    const handleSeeking = useCallback(
        ({ target: { value: seekingTime } }) => setSeekingTime(seekingTime),
        []
    );

    const time = isSeeking ? seekingTime : currentTime;

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
