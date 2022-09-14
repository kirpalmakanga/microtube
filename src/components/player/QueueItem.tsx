import { Component, createMemo } from 'solid-js';
import { VideoData } from '../../../@types/alltypes';
import { formatTime } from '../../lib/helpers';
import Icon from '../Icon';

interface Props extends VideoData {
    index?: number;
    icon: string;
    isActive: boolean;
    onClick: () => void;
    onContextMenu: () => void;
}

const QueueItem: Component<Props> = (props) => {
    const duration = createMemo(() => formatTime(props.duration));

    return (
        <div class="QueueItem" classList={{ 'is-active': props.isActive }}>
            <div
                class="QueueItem__Content"
                onClick={props.onClick}
                onContextMenu={props.onContextMenu}
            >
                <div class="QueueItem__Title">{props.title}</div>

                <div class="QueueItem__Duration">{duration()}</div>
            </div>

            <button
                class="QueueItem__Button icon-button"
                onClick={props.onContextMenu}
            >
                <Icon name="more" />
            </button>
        </div>
    );
};

export default QueueItem;
