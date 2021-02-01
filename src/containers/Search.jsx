import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useStore } from '../store';

import {
    searchVideos,
    clearSearch,
    editPlaylistItem,
    queueItem
} from '../store/actions/youtube';

import List from '../components/List';

import VideoCard from '../components/cards/VideoCard';
import Placeholder from '../components/Placeholder';

import MenuWrapper from '../components/menu/MenuWrapper';

const Search = () => {
    const navigate = useNavigate();
    const { query } = useParams();
    const [
        {
            search: { items, totalResults, forMine }
        },
        dispatch
    ] = useStore();

    const [{ mountGrid }, setState] = useState({
        mountGrid: true
    });

    const handleEditPlaylistItem = ({ id }) => dispatch(editPlaylistItem(id));
    const handleSearchVideos = () => dispatch(searchVideos({ query }));
    const handleClearSearch = () => dispatch(clearSearch());
    const handleQueueItem = (video) => dispatch(queueItem(video));

    useEffect(() => {
        setState({ mountGrid: false });

        clearSearch();

        setTimeout(() => setState({ mountGrid: true }));

        return handleClearSearch;
    }, [query, forMine]);

    return query && mountGrid ? (
        totalResults === 0 ? (
            <Placeholder icon="list" text="No results found." />
        ) : (
            <MenuWrapper
                menuItems={[
                    {
                        title: `Add to queue`,
                        icon: 'circle-add',
                        onClick: handleQueueItem
                    },
                    {
                        title: `Save to playlist`,
                        icon: 'folder-add',
                        onClick: handleEditPlaylistItem
                    }
                ]}
            >
                {(openMenu) => (
                    <List
                        items={items}
                        itemKey={(index, data) => data[index].id}
                        loadMoreItems={handleSearchVideos}
                        renderItem={({ data }) => (
                            <VideoCard
                                {...data}
                                onClick={() => navigate(`/video/${data.id}`)}
                                onClickMenu={() => openMenu(data, data.title)}
                            />
                        )}
                    />
                )}
            </MenuWrapper>
        )
    ) : null;
};

export default Search;
