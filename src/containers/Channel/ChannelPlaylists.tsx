import { Component, Show } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import Placeholder from '../../components/ui/Placeholder';
import { copyText, getPlaylistURL, isMobile, shareURL } from '../../lib/helpers';
import { useChannel } from '../../store/channel';
import { useNotifications } from '../../store/notifications';
import { usePlaylists } from '../../store/playlists';
import Menu from '../../components/ui/Menu';

const Playlists: Component = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [channel, { getPlaylists }] = useChannel(params.channelId as string);

    const [, { queuePlaylist, launchPlaylist }] = usePlaylists();

    const [, { openNotification }] = useNotifications();

    function handleClickCard({ id }: PlaylistData) {
        return () => navigate(`/playlist/${id}`);
    }

    function menuItems(playlistData: PlaylistData) {
        return [
            {
                title: 'Queue playlist',
                icon: 'circle-add',
                onClick: () => queuePlaylist(playlistData, false)
            },
            {
                title: 'Launch playlist',
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
            }
        ];
    }

    return (
        <Show
            when={channel.playlists.totalResults === null || channel.playlists.totalResults > 0}
            fallback={<Placeholder icon="list" text="This channel does not have playlists yet." />}
        >
            <List items={channel.playlists.items} loadItems={getPlaylists}>
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
