import {
    memo,
    useState,
    useCallback,
    FunctionComponent,
    SyntheticEvent
} from 'react';
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

const Info: FunctionComponent<Props> = ({
    title,
    currentTime,
    duration,
    loaded,
    onStartSeeking,
    onEndSeeking
}) => {
    const [seekingTime, setSeekingTime] = useState(currentTime);
    const [isSeeking, setIsSeeking] = useState(false);

    const startSeeking = () => {
        onStartSeeking();

        setIsSeeking(true);
    };

    const endSeeking = () => {
        setIsSeeking(false);

        if (seekingTime !== currentTime) {
            onEndSeeking(seekingTime);
        }
    };

    const handleSeeking = ({
        currentTarget: { value: seekingTime }
    }: SyntheticEvent<HTMLInputElement>) =>
        setSeekingTime(parseInt(seekingTime));

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
