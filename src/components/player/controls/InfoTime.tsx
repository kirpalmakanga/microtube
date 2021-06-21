import { formatTime } from '../../../lib/helpers';

const Time = ({ time = 0, duration = 0 }) => (
    <div className="PlayerInfoTime">
        <span>{duration ? formatTime(time) : '--'}</span>
        <span className="PlayerInfoTime__Separator">/</span>
        <span>{duration ? formatTime(duration) : '--'}</span>
    </div>
);

export default Time;
