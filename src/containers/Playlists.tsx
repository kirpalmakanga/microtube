import { JSXElement, Component, onCleanup, Show } from 'solid-js';
import { useNavigate, useParams } from 'solid-app-router';

import { PlaylistData } from '../../@types/alltypes';

import { usePlaylists } from '../store/hooks/playlists';

import List from '../components/List';
import Placeholder from '../components/Placeholder';
import PlaylistCard from '../components/cards/PlaylistCard';
import MenuWrapper from '../components/menu/MenuWrapper';
import { copyText, getPlaylistURL, isMobile, shareURL } from '../lib/helpers';
import { useNotifications } from '../store/hooks/notifications';

const Playlists: Component = () => {
    const params = useParams();
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
    ] = usePlaylists(params.channelId);

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
        ...(!params.channelId
            ? [
                  {
                      title: 'Remove playlist',
                      icon: 'delete',
                      onClick: removePlaylist
                  }
              ]
            : [])
    ];

    onCleanup(clearPlaylists);

    return (
        <Show
            when={playlists.totalResults === null || playlists.totalResults > 0}
            fallback={
                <Placeholder
                    icon="list"
                    text={
                        params.channelId
                            ? "This channel doesn't have playlists."
                            : "You haven't created playlists yet."
                    }
                />
            }
        >
            <MenuWrapper menuItems={menuItems}>
                {(openMenu: Function) => (
                    <List items={playlists.items} loadItems={getPlaylists}>
                        {(data: PlaylistData): JSXElement => (
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
