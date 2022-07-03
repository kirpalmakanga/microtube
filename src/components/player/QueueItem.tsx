import { Component, createSignal, Show } from 'solid-js';
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
    const [isHovered, setIsHovered] = createSignal(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div
            class="QueueItem shadow--2dp"
            classList={{ 'is-active': props.isActive }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div class="QueueItem__Button icon-button is-drag">
                <Show
                    when={isHovered() || !props.index}
                    fallback={
                        <Show when={props.isActive} fallback={props.index}>
                            <Icon name={props.icon} />
                        </Show>
                    }
                >
                    <Icon name="drag" />
                </Show>
            </div>

            <div
                class="QueueItem__Content"
                onClick={props.onClick}
                onContextMenu={props.onContextMenu}
            >
                <div class="QueueItem__Title">{props.title}</div>

                <div class="QueueItem__Duration">
                    {formatTime(props.duration)}
                </div>
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
