import { useNavigate } from 'solid-app-router';
import { Component, Show } from 'solid-js';
import { PlaylistData } from '../../@types/alltypes';
import PlaylistCard from '../components/cards/PlaylistCard';
import List from '../components/List';
import Placeholder from '../components/Placeholder';
import { copyText, getPlaylistURL, isMobile, shareURL } from '../lib/helpers';
import { useMenu } from '../store/hooks/menu';
import { useNotifications } from '../store/hooks/notifications';
import { usePlaylists } from '../store/hooks/playlists';

const Playlists: Component = () => {
    const navigate = useNavigate();

    const [
        playlists,
        { getPlaylists, removePlaylist, queuePlaylist, launchPlaylist }
    ] = usePlaylists();

    const [, { openNotification }] = useNotifications();

    const [, { openMenu }] = useMenu();

    const handleClickCard =
        ({ id }: PlaylistData) =>
        () =>
            navigate(`/playlist/${id}`);

    const handleClickMenu = (callbackData: PlaylistData) => () => {
        const { title } = callbackData;

        openMenu({
            title,
            callbackData,
            items: [
                {
                    title: 'Queue playlist',
                    icon: 'circle-add',
                    onClick: queuePlaylist
                },
                {
                    title: 'Launch playlist',
                    icon: 'play',
                    onClick: launchPlaylist
                },
                {
                    title: 'Share',
                    icon: 'share',
                    onClick: ({ id, title }: PlaylistData) => {
                        const url = getPlaylistURL(id);

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
                    title: 'Remove playlist',
                    icon: 'delete',
                    onClick: removePlaylist
                }
            ]
        });
    };

    return (
        <Show
            when={playlists.totalResults === null || playlists.totalResults > 0}
            fallback={
                <Placeholder
                    icon="list"
                    text="You haven't created playlists yet."
                />
            }
        >
            <List items={playlists.items} loadItems={getPlaylists}>
                {({ data }) => (
                    <PlaylistCard
                        {...data}
                        onClick={handleClickCard(data)}
                        onClickMenu={handleClickMenu(data)}
                    />
                )}
            </List>
        </Show>
    );
};

export default Playlists;
