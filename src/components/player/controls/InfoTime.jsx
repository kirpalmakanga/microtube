import React, { PureComponent } from 'react';

import { formatTime } from '../../../lib/helpers';

class Time extends PureComponent {
    render() {
        const { currentTime, duration } = this.props;

        return (
            <div className="player__info-time">
                <span>{duration ? formatTime(currentTime) : '--'}</span>
                <span className="separator">/</span>
                <span>{duration ? formatTime(duration) : '--'}</span>
            </div>
        );
    }
}

export default Time;
