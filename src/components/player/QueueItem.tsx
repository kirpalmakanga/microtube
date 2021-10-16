import { Component } from 'solid-js';
import Icon from '../Icon';

import { formatTime, preventDefault, stopPropagation } from '../../lib/helpers';
interface Props {
    title: string;
    duration: number;
    isActive: boolean;
    onClick: () => void;
    onContextMenu: () => void;
    icon: string;
}

const QueueItem: Component<Props> = (props) => (
    <div
        className={`QueueItem shadow--2dp ${props.isActive ? 'is-active' : ''}`}
    >
        <div
            className="QueueItem__Content"
            onClick={props.onClick}
            onContextMenu={props.onContextMenu}
        >
            <div className="QueueItem__Button icon-button">
                <Icon name={props.icon} />
            </div>

            <div className="QueueItem__Title">{props.title}</div>

            <div className="QueueItem__Duration">
                {formatTime(props.duration)}
            </div>
        </div>

        <div
            className="QueueItem__Button icon-button is-drag"
            onContextMenu={preventDefault()}
        >
            <Icon name="drag" />
        </div>

        <button
            className="QueueItem__Button icon-button"
            onClick={stopPropagation(props.onContextMenu)}
        >
            <Icon name="more" />
        </button>
    </div>
);

export default QueueItem;
