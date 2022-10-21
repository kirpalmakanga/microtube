import { Component, createMemo } from 'solid-js';
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
        <div
            class="flex flex-grow items-center h-12 transition-colors cursor-pointer overflow-hidden"
            classList={{
                'bg-primary-700 hover:bg-primary-600': !props.isActive,
                'bg-primary-600 hover:bg-primary-500': props.isActive
            }}
        >
            <div
                class="flex flex-grow items-center text-light-50 leading-none font-montserrat overflow-hidden"
                onClick={props.onClick}
                onContextMenu={props.onContextMenu}
            >
                <div class="flex-grow text-sm uppercase  overflow-ellipsis overflow-hidden whitespace-nowrap px-4">
                    {props.title}
                </div>

                <div class="text-xs">{duration()}</div>
            </div>

            <button
                class="flex flex-shrink-0 items-center justify-center h-10 w-10 group"
                onClick={props.onContextMenu}
            >
                <Icon
                    class="text-light-50 group-hover:(text-opacity-50) transition-colors w-5 h-5"
                    name="more"
                />
            </button>
        </div>
    );
};

export default QueueItem;
