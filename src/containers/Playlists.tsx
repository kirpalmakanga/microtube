import { JSXElement, onCleanup, Show } from 'solid-js';
import { useNavigate, useParams } from 'solid-app-router';

import { PlaylistData } from '../../@types/alltypes';

import { usePlaylists } from '../store/hooks/playlists';

import List from '../components/List';
import Placeholder from '../components/Placeholder';
import PlaylistCard from '../components/cards/PlaylistCard';
import MenuWrapper from '../components/menu/MenuWrapper';
import { copyText, getPlaylistURL, isMobile, shareURL } from '../lib/helpers';
import { useNotifications } from '../store/hooks/notifications';

const Playlists = () => {
    const { channelId } = useParams();
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
    ] = usePlaylists(channelId);

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

    onCleanup(clearPlaylists);

    return (
        <Show
            when={playlists.totalResults === null || playlists.totalResults > 0}
            fallback={
                <Placeholder
                    icon="list"
                    text={
                        channelId
                            ? "This channel doesn't have playlists."
                            : "You haven't created playlists yet."
                    }
                />
            }
        >
            <MenuWrapper
                menuItems={[
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
                    ...(!channelId
                        ? [
                              {
                                  title: 'Remove playlist',
                                  icon: 'delete',
                                  onClick: removePlaylist
                              }
                          ]
                        : [])
                ]}
            >
                {(openMenu: Function): JSXElement => (
                    <List items={playlists.items} loadMoreItems={getPlaylists}>
                        {(index: number): JSXElement => {
                            const { [index]: data } = playlists.items;

                            return (
                                <PlaylistCard
                                    {...data}
                                    onClick={handleClickCard(data)}
                                    onClickMenu={handleClickMenu(
                                        data,
                                        openMenu
                                    )}
                                />
                            );
                        }}
                    </List>
                )}
            </MenuWrapper>
        </Show>
    );
};

export default Playlists;
