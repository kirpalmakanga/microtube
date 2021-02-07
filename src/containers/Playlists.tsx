import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PlaylistData } from '../../@types/alltypes';

import { usePlaylists } from '../store/hooks/playlists';

import List from '../components/List';
import Placeholder from '../components/Placeholder';
import PlaylistCard from '../components/cards/PlaylistCard';
import MenuWrapper from '../components/menu/MenuWrapper';

const Playlists = () => {
    const { channelId } = useParams();
    const navigate = useNavigate();

    const [
        { items, totalResults },
        { getPlaylists, removePlaylist, queuePlaylist, launchPlaylist }
    ] = usePlaylists(channelId);

    const handleClickCard = useCallback(
        ({ id }: PlaylistData) => () => navigate(`/playlist/${id}`),
        []
    );
    const handleClickMenu = useCallback(
        (data: PlaylistData, callback: Function) => () => {
            const { title } = data;

            callback(data, title);
        },
        []
    );

    return totalResults === 0 ? (
        <Placeholder
            icon="list"
            text={
                channelId
                    ? "This channel doesn't have playlists."
                    : "You haven't created playlists yet."
            }
        />
    ) : (
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
            {(openMenu) => (
                <List
                    items={items}
                    itemKey={({ id }: PlaylistData) => id}
                    renderItem={(data: PlaylistData) => (
                        <PlaylistCard
                            {...data}
                            onClick={handleClickCard(data)}
                            onClickMenu={handleClickMenu(data, openMenu)}
                        />
                    )}
                    loadMoreItems={getPlaylists}
                />
            )}
        </MenuWrapper>
    );
};

export default Playlists;
