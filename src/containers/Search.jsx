import React, { Component } from 'react';
import { connect } from 'react-redux';

import { searchVideos, editPlaylistItem } from '../actions/youtube';

import List from '../components/List';

import VideoCard from '../components/cards/VideoCard';
import Placeholder from '../components/Placeholder';

class Search extends Component {
    state = {
        mountGrid: true
    };

    reloadGrid = () => {
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
            reloadGrid
        } = this;

        if (newQuery !== query || newForMine !== forMine) {
            reloadGrid();
        }
    }

    render() {
        const {
            state: { mountGrid },
            props: {
                query,
                items,
                totalResults,
                loadContent,
                queueAndPlayItem,
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
                    loadMoreItems={loadContent}
                    renderItem={({ data }) => (
                        <VideoCard
                            {...data}
                            onClick={() => queueAndPlayItem(data)}
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

const mapDispatchToProps = (
    dispatch,
    {
        match: {
            params: { query = '' }
        }
    }
) => ({
    loadContent: () => dispatch(searchVideos({ query })),

    clearSearch: () => dispatch({ type: 'search/RESET' }),

    queueItem: (data) => dispatch({ type: 'player/QUEUE_PUSH', items: [data] }),

    queueAndPlayItem: (data) => {
        dispatch({ type: 'player/QUEUE_PUSH', items: [data] });
        dispatch({
            type: 'player/SET_ACTIVE_QUEUE_ITEM'
        });
    },

    editPlaylistItem: (data) => dispatch(editPlaylistItem(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);
