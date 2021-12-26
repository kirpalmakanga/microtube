import { useNavigate, useParams } from 'solid-app-router';
import { Component, Show } from 'solid-js';
import { PlaylistData } from '../../../@types/alltypes';
import PlaylistCard from '../../components/cards/PlaylistCard';
import List from '../../components/List';
import Placeholder from '../../components/Placeholder';
import {
    copyText,
    getPlaylistURL,
    isMobile,
    shareURL
} from '../../lib/helpers';
import { useChannel } from '../../store/channel';
import { useMenu } from '../../store/menu';
import { useNotifications } from '../../store/notifications';
import { usePlaylists } from '../../store/playlists';

const Playlists: Component = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [channel, { getPlaylists }] = useChannel(params.channelId);

    const [, { queuePlaylist, launchPlaylist }] = usePlaylists();

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
                }
            ]
        });
    };

    return (
        <Show
            when={
                channel.playlists.totalResults === null ||
                channel.playlists.totalResults > 0
            }
            fallback={
                <Placeholder
                    icon="list"
                    text="This channel does not have playlists yet."
                />
            }
        >
            <List items={channel.playlists.items} loadItems={getPlaylists}>
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
