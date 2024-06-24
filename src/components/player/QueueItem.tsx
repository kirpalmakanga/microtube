import { Component, createMemo } from 'solid-js';
import { A } from '@solidjs/router';
import { formatTime, getThumbnails, stopPropagation } from '../../lib/helpers';
import Icon from '../Icon';
import ListItemThumbnail from '../ListItemThumbnail';
import ListItemMeta from '../ListItemMeta';

interface Props extends VideoData {
    index?: number;
    icon: string;
    isActive: boolean;
    onClick: () => void;
    onClickLink: () => void;
    onContextMenu: () => void;
}

const QueueItem: Component<Props> = (props) => {
    const duration = createMemo(() => formatTime(props.duration));

    return (
        <div
            class="flex flex-grow items-center h-34 transition-colors cursor-pointer overflow-hidden pl-10"
            classList={{
                'bg-primary-700 hover:bg-primary-600': !props.isActive,
                'bg-primary-600 hover:bg-primary-500': props.isActive
            }}
        >
            <div
                class="flex flex-grow text-light-50 leading-none font-montserrat overflow-hidden"
                onClick={props.onClick}
                onContextMenu={props.onContextMenu}
            >
                <ListItemThumbnail
                    img={getThumbnails(props.thumbnails, 'medium')}
                    alt={props.title}
                    badge={duration()}
                />

                <ListItemMeta
                    title={props.title}
                    subtitle={
                        <A
                            href={`/channel/${props.channelId}`}
                            onClick={stopPropagation(props.onClickLink)}
                        >
                            {props.channelTitle}
                        </A>
                    }
                />

                <div class="text-xs"></div>
            </div>

            <button
                class="flex flex-shrink-0 items-center justify-center h-full w-10 group"
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
