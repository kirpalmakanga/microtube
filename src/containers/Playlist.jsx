import { useEffect } from './Channel/react';
import { useDispatch, useSelector } from './Channel/react-redux';
import { useParams, useNavigate } from './Channel/react-router-dom';

import {
    getPlaylistTitle,
    getPlaylistItems,
    clearPlaylistItems,
    queueItem,
    removePlaylistItem,
    editPlaylistItem
} from '../actions/youtube';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import VideoCard from '../components/cards/VideoCard';
import MenuWrapper from '../components/menu/MenuWrapper';

const Playlist = () => {
    const navigate = useNavigate();
    const { playlistId } = useParams();

    const { items, totalResults } = useSelector(
        ({ playlistItems: { items, totalResults } }) => ({
            items,
            totalResults
        })
    );

    const dispatch = useDispatch();

    const handleEditPlaylistItem = ({ id }) => dispatch(editPlaylistItem(id));

    const handleQueueItem = (video) => dispatch(queueItem(video));

    const handleRemovePlaylistItem = ({ playlistItemId, playlistId, title }) =>
        dispatch(removePlaylistItem(playlistItemId, playlistId, title));

    const handleGetPlaylistItems = () => dispatch(getPlaylistItems(playlistId));

    const handleClearPlaylistItems = () => dispatch(clearPlaylistItems());

    useEffect(() => {
        dispatch(getPlaylistTitle(playlistId));

        return handleClearPlaylistItems;
    }, [playlistId]);

    return totalResults === 0 ? (
        <Placeholder icon="list" text="This playlist is empty." />
    ) : (
        <MenuWrapper
            menuItems={[
                {
                    title: 'Add to queue',
                    icon: 'circle-add',
                    onClick: handleQueueItem
                },

                {
                    title: 'Save to playlist',
                    icon: 'folder-add',
                    onClick: handleEditPlaylistItem
                },

                {
                    title: 'Remove from playlist',
                    icon: 'delete',
                    onClick: handleRemovePlaylistItem
                }
            ]}
        >
            {(openMenu) => (
                <List
                    items={items}
                    itemKey={(index, data) => data[index].id}
                    renderItem={({ data }) => (
                        <VideoCard
                            {...data}
                            onClick={() => navigate(`/video/${data.id}`)}
                            onClickMenu={() => openMenu(data, data.title)}
                        />
                    )}
                    loadMoreItems={handleGetPlaylistItems}
                />
            )}
        </MenuWrapper>
    );
};

const mapDispatchToProps = {
    getPlaylistTitle,
    getPlaylistItems,
    clearPlaylistItems,
    editPlaylistItem,
    removePlaylistItem,
    queueItem
};

export default Playlist;
