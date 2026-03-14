import { Component, createSignal } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import {
    copyText,
    formatDate,
    formatTime,
    getVideoURL,
    isMobile,
    shareURL,
    stopPropagation
} from '../../lib/helpers';
import { useNotifications } from '../../store/notifications';
import { usePlayer } from '../../store/player';
import { usePlaylistItems } from '../../store/playlist-items';
import ListItem from '../../components/ListItem';
import PlaylistSelectorModal from './PlaylistSelectorModal';
import Menu, { MenuItemData } from '../ui/Menu';

interface PlaylistItemProps {
    index: number;
    data: PlaylistItemData;
}

const PlaylistItem: Component<PlaylistItemProps> = (props) => {
    const navigate = useNavigate();

    const [isPlaylistSelectorVisible, setIsPlaylistSelectorVisible] = createSignal<boolean>(false);
    const [isMenuVisible, setIsMenuVisible] = createSignal<boolean>(false);

    const [, { editPlaylistItem, removePlaylistItem }] = usePlaylistItems(props.data.playlistId);

    const [, { queueItem }] = usePlayer();

    const [, { openNotification }] = useNotifications();

    function openPlaylistSelector() {
        setIsPlaylistSelectorVisible(true);
    }

    function closePlaylistSelector() {
        setIsPlaylistSelectorVisible(false);
    }

    function openMenu() {
        setIsMenuVisible(true);
    }

    function closeMenu() {
        setIsMenuVisible(false);
    }

    function goToPlaylistItem() {
        navigate(`/video/${props.data.id}`);
    }

    function onSelectPlaylist(playlistData: PlaylistData) {
        editPlaylistItem(props.data, playlistData);
    }

    const menuItems: MenuItemData[] = [
        {
            title: 'Add to queue',
            icon: 'circle-add',
            onClick: () => queueItem(props.data)
        },
        {
            title: 'Save',
            icon: 'bookmark-outline',
            onClick: openPlaylistSelector
        },
        {
            title: 'Share',
            icon: 'share',
            onClick: () => {
                const url = getVideoURL(props.data.id);

                if (isMobile()) {
                    shareURL({
                        title: props.data.title,
                        url
                    });
                } else {
                    copyText(url);

                    openNotification('Copied link to clipboard.');
                }
            }
        },
        {
            title: 'Remove from playlist',
            icon: 'delete',
            color: 'error',
            onClick: () => removePlaylistItem(props.data)
        }
    ];

    return (
        <>
            <ListItem
                {...props.data}
                index={props.index}
                badge={formatTime(props.data.duration)}
                subtitle={
                    <A href={`/channel/${props.data.channelId}`} onClick={stopPropagation()}>
                        {props.data.channelTitle}
                    </A>
                }
                subSubtitle={formatDate(props.data.publishedAt, 'MMMM do yyyy')}
                onClick={goToPlaylistItem}
                onClickMenu={openMenu}
            />

            <PlaylistSelectorModal
                isVisible={isPlaylistSelectorVisible()}
                onClickItem={onSelectPlaylist}
                onClickClose={closePlaylistSelector}
            />

            <Menu
                title={props.data.title}
                items={menuItems}
                isVisible={isMenuVisible()}
                onClickClose={closeMenu}
            />
        </>
    );
};

export default PlaylistItem;
