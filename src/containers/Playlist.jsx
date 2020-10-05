import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

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

const Playlist = ({
    items,
    totalResults,
    getPlaylistTitle,
    getPlaylistItems,
    clearPlaylistItems,
    queueItem,
    removePlaylistItem,
    editPlaylistItem
}) => {
    const navigate = useNavigate();
    const { playlistId } = useParams();

    useEffect(() => {
        getPlaylistTitle(playlistId);

        return clearPlaylistItems;
    }, [playlistId]);

    return totalResults === 0 ? (
        <Placeholder icon="list" text="This playlist is empty." />
    ) : (
        <MenuWrapper
            menuItems={[
                {
                    title: 'Add to queue',
                    icon: 'circle-add',
                    onClick: queueItem
                },

                {
                    title: 'Save to playlist',
                    icon: 'folder-add',
                    onClick: ({ id }) => editPlaylistItem(id)
                },

                {
                    title: 'Remove from playlist',
                    icon: 'delete',
                    onClick: ({ playlistItemId, playlistId, title }) =>
                        removePlaylistItem(playlistItemId, playlistId, title)
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
                    loadMoreItems={() => getPlaylistItems(playlistId)}
                />
            )}
        </MenuWrapper>
    );
};

const mapStateToProps = ({
    playlistItems: { playlistTitle, items, nextPageToken, totalResults }
}) => ({
    playlistTitle,
    items,
    nextPageToken,
    totalResults
});

const mapDispatchToProps = {
    getPlaylistTitle,
    getPlaylistItems,
    clearPlaylistItems,
    editPlaylistItem,
    removePlaylistItem,
    queueItem
};

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
