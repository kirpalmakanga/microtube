import { memo, useState } from 'react';
import { preventDefault } from '../../lib/helpers';

import InfoTime from './controls/InfoTime';
import InfoProgress from './controls/InfoProgress';

const noop = () => {};

const Info = ({
    title = '',
    currentTime = 0,
    duration = 0,
    loaded = 0,
    onStartSeeking = noop,
    onEndSeeking = noop
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

    const handleSeeking = ({ target: { value: seekingTime } }) =>
        setSeekingTime(seekingTime);

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
                max={parseInt(duration)}
                onWheel={preventDefault()}
                onInput={handleSeeking}
                onMouseDown={startSeeking}
                onMouseUp={endSeeking}
            />
        </div>
    );
};

export default memo(Info);
