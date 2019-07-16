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

class Search extends Component {
    state = {
        mountGrid: true
    };

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
            state: { mountGrid },
            props: {
                query,
                items,
                totalResults,
                searchVideos,
                playItem,
                queueItem,
                editPlaylistItem
            }
        } = this;

        return query && mountGrid ? (
            totalResults === 0 ? (
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
                            queueItem={() => queueItem(data)}
                            editPlaylistItem={() => editPlaylistItem(data)}
                        />
                    )}
                />
            )
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);
