import { Component, onCleanup, onMount, Show } from 'solid-js';
import { useNavigate, useParams } from 'solid-app-router';

import List from '../components/List';
import Placeholder from '../components/Placeholder';
import VideoCard from '../components/cards/VideoCard';
import MenuWrapper from '../components/menu/MenuWrapper';
import { PlaylistItemData } from '../../@types/alltypes';
import { copyText, getVideoURL, isMobile, shareURL } from '../lib/helpers';
import { useNotifications } from '../store/hooks/notifications';
import { usePlaylistItems } from '../store/hooks/playlist-items';
import { usePlayer } from '../store/hooks/player';

const Playlists: Component = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [
        playlistItems,
        {
            getPlaylistTitle,
            getPlaylistItems,
            editPlaylistItem,
            removePlaylistItem,
            clearPlaylistItems
        }
    ] = usePlaylistItems(params.playlistId);

    const [, { queueItem }] = usePlayer();

    const [, { openNotification }] = useNotifications();

    const handleClickCard =
        ({ id }: PlaylistItemData) =>
        () =>
            navigate(`/video/${id}`);

    const handleClickMenu =
        (data: PlaylistItemData, callback: Function) => () => {
            const { title } = data;

            callback(data, title);
        };

    const handleSharing = ({ id, title }: PlaylistItemData) => {
        const url = getVideoURL(id);

        if (isMobile()) {
            shareURL({
                title,
                url
            });
        } else {
            copyText(url);

            openNotification('Copied link to clipboard.');
        }
    };

    const menuItems = [
        {
            title: 'Add to queue',
            icon: 'circle-add',
            onClick: queueItem
        },
        {
            title: 'Save to playlist',
            icon: 'folder-add',
            onClick: editPlaylistItem
        },
        {
            title: 'Share',
            icon: 'share',
            onClick: handleSharing
        },
        {
            title: 'Remove from playlist',
            icon: 'delete',
            onClick: removePlaylistItem
        }
    ];

    onMount(() => getPlaylistTitle(params.playlistId));

    onCleanup(clearPlaylistItems);

    return (
        <Show
            when={
                playlistItems.totalResults === null ||
                playlistItems.totalResults > 0
            }
            fallback={
                <Placeholder icon="list" text="This playlist is empty." />
            }
        >
            <MenuWrapper menuItems={menuItems}>
                {({ openMenu }) => (
                    <List
                        items={playlistItems.items}
                        loadItems={getPlaylistItems}
                    >
                        {({ data }): JSXElement => (
                            <VideoCard
                                {...data}
                                onClick={handleClickCard(data)}
                                onClickMenu={handleClickMenu(data, openMenu)}
                            />
                        )}
                    </List>
                )}
            </MenuWrapper>
        </Show>
    );
};

export default Playlists;
