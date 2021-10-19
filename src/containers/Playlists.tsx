import { JSXElement, Component, onCleanup, Show, JSX } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { PlaylistData } from '../../@types/alltypes';

import { usePlaylists } from '../store/hooks/playlists';

import List from '../components/List';
import Placeholder from '../components/Placeholder';
import PlaylistCard from '../components/cards/PlaylistCard';
import MenuWrapper, { MenuOpener } from '../components/menu/MenuWrapper';
import { copyText, getPlaylistURL, isMobile, shareURL } from '../lib/helpers';
import { useNotifications } from '../store/hooks/notifications';

const Playlists: Component = () => {
    const navigate = useNavigate();

    const [
        playlists,
        {
            getPlaylists,
            removePlaylist,
            queuePlaylist,
            launchPlaylist,
            clearPlaylists
        }
    ] = usePlaylists();

    const [, { openNotification }] = useNotifications();

    const handleClickCard =
        ({ id }: PlaylistData) =>
        () =>
            navigate(`/playlist/${id}`);

    const handleClickMenu = (data: PlaylistData, callback: Function) => () => {
        const { title } = data;

        callback(data, title);
    };

    const handleSharing = ({ id, title }: PlaylistData) => {
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
    };

    const menuItems = [
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
            onClick: handleSharing
        },
        {
            title: 'Remove playlist',
            icon: 'delete',
            onClick: removePlaylist
        }
    ];

    onCleanup(clearPlaylists);

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
            <MenuWrapper menuItems={menuItems}>
                {({ openMenu }) => (
                    <List items={playlists.items} loadItems={getPlaylists}>
                        {({ data }: { data: PlaylistData }) => (
                            <PlaylistCard
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
