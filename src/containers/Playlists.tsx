import { Component, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import List from '../components/List';
import ListItem from '../components/ListItem';
import Placeholder from '../components/ui/Placeholder';
import Menu, { MenuItemData } from '../components/ui/Menu';
import { useNotifications } from '../store/notifications';
import { usePlaylists } from '../store/playlists';
import { copyText, getPlaylistURL, isMobile, shareURL } from '../lib/helpers';

const Playlists: Component = () => {
    const navigate = useNavigate();
    const [playlists, { getPlaylists, removePlaylist, queuePlaylist, launchPlaylist }] =
        usePlaylists();
    const [, { openNotification }] = useNotifications();

    function handleClickCard({ id }: PlaylistData) {
        return () => navigate(`/playlist/${id}`);
    }

    function menuItems(playlistData: PlaylistData): MenuItemData[] {
        return [
            {
                title: 'Queue',
                icon: 'circle-add',
                onClick: () => queuePlaylist(playlistData, false)
            },
            {
                title: 'Launch',
                icon: 'play',
                onClick: () => launchPlaylist(playlistData)
            },
            {
                title: 'Share',
                icon: 'share',
                onClick: () => {
                    const url = getPlaylistURL(playlistData.id);

                    if (isMobile()) {
                        shareURL({
                            title: playlistData.title,
                            url
                        });
                    } else {
                        copyText(url);

                        openNotification('Copied link to clipboard.');
                    }
                }
            },
            {
                title: 'Remove',
                icon: 'delete',
                onClick: () => removePlaylist(playlistData)
            }
        ];
    }

    return (
        <Show
            when={playlists.totalResults === null || playlists.totalResults > 0}
            fallback={<Placeholder icon="list" text="You haven't created playlists yet." />}
        >
            <List items={playlists.items} loadItems={getPlaylists}>
                {({ data }) => (
                    <Menu title={data.title} items={menuItems(data)}>
                        {(openMenu) => (
                            <ListItem
                                {...data}
                                badge={`${data.itemCount} video${data.itemCount !== 1 ? 's' : ''}`}
                                onClick={handleClickCard(data)}
                                onClickMenu={openMenu}
                            />
                        )}
                    </Menu>
                )}
            </List>
        </Show>
    );
};

export default Playlists;
