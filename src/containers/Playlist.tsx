import { Component, onCleanup, onMount, Show } from 'solid-js';
import { NavLink, useNavigate, useParams } from '@solidjs/router';
import List from '../components/List';
import Placeholder from '../components/Placeholder';
import {
    copyText,
    formatDate,
    formatTime,
    getVideoURL,
    isMobile,
    shareURL,
    stopPropagation
} from '../lib/helpers';
import { useMenu } from '../store/menu';
import { useNotifications } from '../store/notifications';
import { usePlayer } from '../store/player';
import { usePlaylistItems } from '../store/playlist-items';
import ListItem from '../components/ListItem';

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

    const [, { openMenu }] = useMenu();

    const handleClickCard =
        ({ id }: PlaylistItemData) =>
        () =>
            navigate(`/video/${id}`);

    const handleClickMenu = (callbackData: PlaylistItemData) => () => {
        const { title } = callbackData;

        openMenu({
            title,
            callbackData,
            items: [
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
                    onClick: ({ id, title }: PlaylistItemData) => {
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
                    }
                },
                {
                    title: 'Remove from playlist',
                    icon: 'delete',
                    onClick: removePlaylistItem
                }
            ]
        });
    };

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
            <List items={playlistItems.items} loadItems={getPlaylistItems}>
                {({ index, data }) => (
                    <ListItem
                        {...data}
                        index={index}
                        badge={formatTime(data.duration)}
                        subtitle={
                            <NavLink
                                href={`/channel/${data.channelId}`}
                                onClick={stopPropagation()}
                            >
                                {data.channelTitle}
                            </NavLink>
                        }
                        subSubtitle={formatDate(
                            data.publishedAt,
                            'MMMM do yyyy'
                        )}
                        onClick={handleClickCard(data)}
                        onClickMenu={handleClickMenu(data)}
                    />
                )}
            </List>
        </Show>
    );
};

export default Playlists;
