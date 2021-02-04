import Icon from '../Icon';

import { formatTime, stopPropagation } from '../../lib/helpers';

const QueueItem = ({
    title,
    duration,
    isActive,
    onClickMenu,
    icon,
    ...props
}) => (
    <div
        className={[
            'queue__item shadow--2dp',
            isActive ? 'queue__item--active' : ''
        ].join(' ')}
        {...props}
        onContextMenu={onClickMenu}
    >
        <div className="queue__item-button icon-button">
            <Icon name={icon} />
        </div>

        <div className="queue__item-title">{title}</div>

        <div className="queue__item-duration">{formatTime(duration)}</div>

        <button
            className="queue__item-button icon-button"
            onClick={stopPropagation(onClickMenu)}
        >
            <Icon name="more" />
        </button>
    </div>
);

export default QueueItem;
