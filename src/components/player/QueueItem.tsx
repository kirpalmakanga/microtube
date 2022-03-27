import { Component } from 'solid-js';
import { VideoData } from '../../../@types/alltypes';
import { formatTime, preventDefault, stopPropagation } from '../../lib/helpers';
import Icon from '../Icon';

interface Props extends VideoData {
    icon: string;
    isActive: boolean;
    onClick: () => void;
    onContextMenu: () => void;
}

const QueueItem: Component<Props> = (props) => (
    <div
        className="QueueItem shadow--2dp"
        classList={{ 'is-active': props.isActive }}
        onDragStart={preventDefault(stopPropagation())}
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
