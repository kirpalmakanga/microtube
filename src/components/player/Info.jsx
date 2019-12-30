import { PureComponent } from 'react';
import { preventDefault } from '../../lib/helpers';

import InfoTime from './controls/InfoTime';
import InfoProgress from './controls/InfoProgress';

class Info extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { isSeeking: false, currentTime: props.currentTime };
    }

    startSeeking = () => {
        this.props.onStartSeeking();

        this.setState({ isSeeking: true });
    };

    endSeeking = () => {
        const {
            state: { currentTime },
            props: { currentTime: playerCurrentTime }
        } = this;

        this.setState({ isSeeking: false }, () => {
            if (currentTime !== playerCurrentTime) {
                this.props.onEndSeeking(currentTime);
            }
        });
    };

    handleSeeking = ({ target: { value: currentTime } }) =>
        this.setState({ currentTime });

    render() {
        const {
            state: { isSeeking, currentTime: innerCurrentTime },
            props: { title, currentTime: playerCurrentTime, duration, loaded },
            startSeeking,
            endSeeking,
            handleSeeking
        } = this;

        const currentTime = isSeeking ? innerCurrentTime : playerCurrentTime;

        return (
            <div className="player__info">
                <InfoProgress
                    percentElapsed={
                        duration
                            ? (isSeeking ? currentTime : playerCurrentTime) /
                              duration
                            : 0
                    }
                    percentLoaded={loaded}
                />

                <div className="player__info-title">{title}</div>

                <InfoTime currentTime={currentTime} duration={duration} />

                <label className="sr-only" labelfor="seek-time">
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
                    onChange={handleSeeking}
                    onMouseDown={startSeeking}
                    onMouseUp={endSeeking}
                />
            </div>
        );
    }
}

export default Info;
