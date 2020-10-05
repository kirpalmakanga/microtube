import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import {
    searchVideos,
    clearSearch,
    editPlaylistItem,
    queueItem,
    playItem
} from '../actions/youtube';

import List from '../components/List';

import VideoCard from '../components/cards/VideoCard';
import Placeholder from '../components/Placeholder';

import MenuWrapper from '../components/menu/MenuWrapper';

const Search = ({
    items,
    totalResults,
    forMine,
    searchVideos,
    queueItem,
    editPlaylistItem,
    clearSearch
}) => {
    const navigate = useNavigate();
    const { query } = useParams();

    const [{ mountGrid }, setState] = useState({
        mountGrid: true
    });

    const reloadQuery = () => {
        setState({ mountGrid: false });

        clearSearch();

        setTimeout(() => setState({ mountGrid: true }));
    };

    useEffect(() => {
        reloadQuery();

        return clearSearch;
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
                        onClick: queueItem
                    },
                    {
                        title: `Save to playlist`,
                        icon: 'folder-add',
                        onClick: ({ id }) => editPlaylistItem(id)
                    }
                ]}
            >
                {(openMenu) => (
                    <List
                        items={items}
                        itemKey={(index, data) => data[index].id}
                        loadMoreItems={() => searchVideos({ query })}
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

const mapStateToProps = ({ search: { items, forMine, totalResults } }) => ({
    forMine,
    items,
    totalResults
});

const mapDispatchToProps = {
    searchVideos,
    clearSearch,
    queueItem,
    playItem,
    editPlaylistItem
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
