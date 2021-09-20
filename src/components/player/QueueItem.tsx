import Icon from '../Icon';

import { formatTime, preventDefault, stopPropagation } from '../../lib/helpers';
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
    <div className={`QueueItem shadow--2dp ${isActive ? 'is-active' : ''}`}>
        <div
            className="QueueItem__Content"
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            <div className="QueueItem__Button icon-button">
                <Icon name={icon} />
            </div>

            <div className="QueueItem__Title">{title}</div>

            <div className="QueueItem__Duration">{formatTime(duration)}</div>
        </div>

        <div
            className="QueueItem__Button icon-button is-drag"
            onContextMenu={preventDefault()}
        >
            <Icon name="drag" />
        </div>

        <button
            className="QueueItem__Button icon-button"
            onClick={stopPropagation(onContextMenu)}
        >
            <Icon name="more" />
        </button>
    </div>
);

export default QueueItem;
