import { formatTime } from '../../../lib/helpers';

const Time = ({ time = 0, duration = 0 }) => (
    <div className="player__info-time">
        <span>{duration ? formatTime(time) : '--'}</span>
        <span className="separator">/</span>
        <span>{duration ? formatTime(duration) : '--'}</span>
    </div>
);

export default Time;
