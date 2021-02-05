import Icon from '../Icon';

import { formatTime, stopPropagation } from '../../lib/helpers';
import { FunctionComponent, MouseEvent, SyntheticEvent } from 'react';

interface Props {
    title: string;
    duration: number;
    isActive: boolean;
    onClick: () => void;
    onContextMenu: (e: MouseEvent<HTMLElement> | SyntheticEvent) => void;
    icon: string;
}

const QueueItem: FunctionComponent<Props> = ({
    title,
    duration,
    isActive,
    onClick,
    onContextMenu,
    icon
}) => (
    <div
        className={[
            'queue__item shadow--2dp',
            isActive ? 'queue__item--active' : ''
        ].join(' ')}
        onClick={onClick}
        onContextMenu={onContextMenu}
    >
        <div className="queue__item-button icon-button">
            <Icon name={icon} />
        </div>

        <div className="queue__item-title">{title}</div>

        <div className="queue__item-duration">{formatTime(duration)}</div>

        <button
            className="queue__item-button icon-button"
            onClick={stopPropagation(onContextMenu)}
        >
            <Icon name="more" />
        </button>
    </div>
);

export default QueueItem;
