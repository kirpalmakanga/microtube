import { JSXElement, Component, onCleanup, Show } from 'solid-js';
import { useNavigate, useParams } from 'solid-app-router';

import { PlaylistData } from '../../../@types/alltypes';

import { usePlaylists } from '../../store/hooks/playlists';

import List from '../../components/List';
import Placeholder from '../../components/Placeholder';
import PlaylistCard from '../../components/cards/PlaylistCard';
import MenuWrapper from '../../components/menu/MenuWrapper';
import {
    copyText,
    getPlaylistURL,
    isMobile,
    shareURL
} from '../../lib/helpers';
import { useNotifications } from '../../store/hooks/notifications';
import { useChannel } from '../../store/hooks/channel';

const Playlists: Component = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [channel, { getPlaylists, clearPlaylists }] = useChannel(
        params.channelId
    );

    const [{ queuePlaylist, launchPlaylist }] = usePlaylists();

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
        }
    ];

    onCleanup(clearPlaylists);

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
            <MenuWrapper menuItems={menuItems}>
                {(openMenu: Function) => (
                    <List
                        items={channel.playlists.items}
                        loadItems={getPlaylists}
                    >
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
