import { Component, Show, createMemo, createSignal } from 'solid-js';
import { A } from '@solidjs/router';
import {
    copyText,
    formatTime,
    getThumbnails,
    getVideoURL,
    isMobile,
    omit,
    shareURL,
    stopPropagation
} from '../../lib/helpers';
import Icon from '../ui/Icon';
import ListItemThumbnail from '../ListItemThumbnail';
import ListItemMeta from '../ListItemMeta';
import EqualizerIcon from '../ui/EqualizerIcon';
import Menu, { MenuItemData } from '../ui/Menu';
import { usePlayer } from '../../store/player';
import { useNotifications } from '../../store/notifications';
import { usePlaylistItems } from '../../store/playlist-items';
import PlaylistSelectorModal from '../playlist/PlaylistSelectorModal';

interface QueueItemProps extends VideoData {
    index?: number;
    isActive: boolean;
    isPlaying: boolean;
    onClick: () => void;
    onClickLink: () => void;
}

const QueueItem: Component<QueueItemProps> = (props) => {
    const [, { removeQueueItem }] = usePlayer();
    const [, { editPlaylistItem }] = usePlaylistItems();
    const [, { openNotification }] = useNotifications();
    const [isPlaylistSelectorVisible, setIsPlaylistSelectorVisible] = createSignal<boolean>(false);
    const duration = createMemo(() => formatTime(props.duration));

    function openPlaylistSelector() {
        setIsPlaylistSelectorVisible(true);
    }

    function closePlaylistSelector() {
        setIsPlaylistSelectorVisible(false);
    }

    function onSelectPlaylist(playlistData: PlaylistData) {
        editPlaylistItem(
            omit(props, 'index', 'isActive', 'isPlaying', 'onClick', 'onClickLink'),
            playlistData
        );
    }

    const menuItems: MenuItemData[] = [
        {
            title: 'Save',
            icon: 'bookmark-outline',
            onClick: openPlaylistSelector
        },
        {
            title: 'Share',
            icon: 'share',
            onClick: () => {
                const url = getVideoURL(props.id);

                if (isMobile()) {
                    shareURL({
                        title: props.title,
                        url
                    });
                } else {
                    copyText(url);

                    openNotification('Copied link to clipboard.');
                }
            }
        },
        {
            title: 'Remove from queue',
            icon: 'delete',
            color: 'error',
            onClick: () => removeQueueItem(props.id)
        }
    ];

    return (
        <>
            <Menu title={props.title} items={menuItems}>
                {(openMenu) => (
                    <div
                        class="flex flex-grow items-center h-34 transition-colors overflow-hidden pl-10"
                        classList={{
                            'bg-primary-700 hover:bg-primary-600': !props.isActive,
                            'bg-primary-600 hover:bg-primary-500': props.isActive
                        }}
                    >
                        <div class="absolute left-0 top-0 bottom-0 flex flex-shrink-0 items-center justify-center w-10 text-light-50 text-sm group-hover:hidden">
                            <Show when={props.isActive} fallback={props.index}>
                                <EqualizerIcon class="w-6 h-6" isAnimated={props.isPlaying} />
                            </Show>
                        </div>

                        <div
                            class="flex flex-grow text-light-50 leading-none font-montserrat overflow-hidden gap-4 cursor-pointer"
                            onClick={props.onClick}
                            onContextMenu={openMenu}
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
                            class="flex flex-shrink-0 items-center justify-center p-2 group"
                            onClick={openMenu}
                        >
                            <Icon
                                class="text-light-50 group-hover:(text-opacity-50) transition-colors w-5 h-5"
                                name="more"
                            />
                        </button>
                    </div>
                )}
            </Menu>

            <PlaylistSelectorModal
                isVisible={isPlaylistSelectorVisible()}
                onClickItem={onSelectPlaylist}
                onClickClose={closePlaylistSelector}
            />
        </>
    );
};

export default QueueItem;
