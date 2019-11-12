import React, { Component } from 'react';
import { connect } from 'react-redux';

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

import Menu from '../components/menu/Menu';
import MenuItem from '../components/menu/MenuItem';

class Search extends Component {
    state = {
        mountGrid: true,
        isMenuOpen: false,
        videoData: {}
    };

    openMenu = (videoData) => this.setState({ isMenuOpen: true, videoData });

    closeMenu = () => this.setState({ isMenuOpen: false, videoData: {} });

    reloadQuery = () => {
        const { clearSearch } = this.props;

        this.setState({ mountGrid: false }, () => {
            clearSearch();

            this.setState({ mountGrid: true });
        });
    };

    componentWillUnmount() {
        this.props.clearSearch();
    }

    componentDidUpdate({ query, forMine }) {
        const {
            props: { query: newQuery, forMine: newForMine },
            reloadQuery
        } = this;

        if (newQuery !== query || newForMine !== forMine) {
            reloadQuery();
        }
    }

    render() {
        const {
            props: {
                query,
                items,
                totalResults,
                searchVideos,
                playItem,
                queueItem,
                editPlaylistItem
            },
            state: { mountGrid, isMenuOpen, videoData },
            openMenu,
            closeMenu
        } = this;

        const { id: videoId, title: videoTitle, playlistItemId } = videoData;

        return query && mountGrid ? (
            <>
                {totalResults === 0 ? (
                    <Placeholder icon="empty" text="No results found." />
                ) : (
                    <List
                        items={items}
                        itemKey={(index, data) => data[index].id}
                        loadMoreItems={() => searchVideos({ query })}
                        renderItem={({ data }) => (
                            <VideoCard
                                {...data}
                                onClick={() => playItem(data)}
                                onClickMenu={() => openMenu(data)}
                                editPlaylistItem={() =>
                                    editPlaylistItem(data.id)
                                }
                            />
                        )}
                    />
                )}

                <Menu isVisible={isMenuOpen} onClick={closeMenu}>
                    <MenuItem
                        title={`Add "${videoTitle}" to queue`}
                        icon="queue"
                        onClick={() => queueItem(videoData)}
                    />

                    <MenuItem
                        title={`Add "${videoTitle}" to playlist`}
                        icon="playlist-add"
                        onClick={() => editPlaylistItem(videoId)}
                    />
                </Menu>
            </>
        ) : null;
    }
}

const mapStateToProps = (
    { search: { items, forMine, totalResults } },
    {
        match: {
            params: { query = '' }
        }
    }
) => ({
    query,
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
