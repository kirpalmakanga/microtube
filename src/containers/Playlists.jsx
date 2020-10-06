import { useEffect } from './Channel/react';
import { useDispatch, useSelector } from './Channel/react-redux';
import { useNavigate, useParams } from './Channel/react-router-dom';

import {
    getPlaylists,
    clearPlaylists,
    queuePlaylist,
    removePlaylist
} from '../actions/youtube';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import PlaylistCard from '../components/cards/PlaylistCard';

import MenuWrapper from '../components/menu/MenuWrapper';

const Playlists = () => {
    const { channelId } = useParams();
    const navigate = useNavigate();

    const { items, totalResults } = useSelector(
        ({ playlists: { items, totalResults } }) => ({
            items,
            totalResults
        })
    );

    const dispatch = useDispatch();

    const handleGetPlaylists = () =>
        dispatch(getPlaylists(channelId ? { channelId } : { mine: true }));

    const handleClearPlaylists = () => dispatch(clearPlaylists());

    const handleQueuePlaylist = ({ id }) => dispatch(queuePlaylist(id));

    const handleLaunchPlaylist = ({ id }) => dispatch(queuePlaylist(id, true));

    const handleRemovePlaylist = ({ id, title }) =>
        dispatch(removePlaylist(id, title));

    useEffect(() => handleClearPlaylists, []);

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
                    onClick: handleQueuePlaylist
                },
                {
                    title: 'Launch playlist',
                    icon: 'play',
                    onClick: handleLaunchPlaylist
                },
                ...(!channelId
                    ? [
                          {
                              title: 'Remove playlist',
                              icon: 'delete',
                              onClick: handleRemovePlaylist
                          }
                      ]
                    : [])
            ]}
        >
            {(openMenu) => (
                <List
                    items={items}
                    itemKey={(index, data) => data[index].id}
                    renderItem={({ data }) => {
                        const { id, title } = data;

                        return (
                            <PlaylistCard
                                {...data}
                                onClick={() => navigate(`/playlist/${id}`)}
                                onClickMenu={() =>
                                    openMenu({ id, title }, title)
                                }
                            />
                        );
                    }}
                    loadMoreItems={handleGetPlaylists}
                />
            )}
        </MenuWrapper>
    );
};

export default Playlists;
