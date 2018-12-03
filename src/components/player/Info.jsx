import React, { PureComponent } from 'react';
import { preventDefault } from '../../lib/helpers';

import InfoTime from './controls/InfoTime';
import InfoProgress from './controls/InfoProgress';

class Info extends PureComponent {
    render() {
        const { title, currentTime, duration, loaded, seekTime } = this.props;

        return (
            <div className="player__info">
                <InfoProgress
                    percentElapsed={duration ? currentTime / duration : 0}
                    percentLoaded={loaded}
                />

                <div className="player__info-title">{title}</div>

                <InfoTime currentTime={currentTime} duration={duration} />

                <label className="sr-only" labelfor="seek-time">
                    Seek time
                </label>

                <input
                    id="seek-time"
                    className="player__info-progress-loaded"
                    type="range"
                    min="0"
                    max={parseInt(duration)}
                    onWheel={preventDefault}
                    onChange={({ target: { value } }) => seekTime(value)}
                />
            </div>
        );
    }
}

export default Info;
