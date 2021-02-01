import { useNavigate, useParams } from 'react-router-dom';

import usePlaylists from '../store/hooks/playlists';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import PlaylistCard from '../components/cards/PlaylistCard';

import MenuWrapper from '../components/menu/MenuWrapper';

const Playlists = () => {
    const { channelId } = useParams();
    const navigate = useNavigate();

    const [
        { items, totalResults },
        {
            getPlaylists,
            clearPlaylists,
            removePlaylist,
            queuePlaylist,
            launchPlaylist
        }
    ] = usePlaylists();

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
                    itemKey={(index, { [index]: { id } }) => id}
                    renderItem={({ data }) => {
                        const { id, title } = data;

                        return (
                            <PlaylistCard
                                {...data}
                                onClick={() => navigate(`/playlist/${id}`)}
                                onClickMenu={() => openMenu(data, title)}
                            />
                        );
                    }}
                    loadMoreItems={getPlaylists}
                />
            )}
        </MenuWrapper>
    );
};

export default Playlists;
