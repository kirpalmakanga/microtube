import React, { Component } from 'react';
import { connect } from 'react-redux';

import { searchVideos, editPlaylistItem } from '../actions/youtube';

import List from '../components/List';

import VideoCard from '../components/cards/VideoCard';

class Search extends Component {
    state = {
        mountGrid: true
    };

    getQuery = () => this.props.query;

    loadContent = async () => {
        const { query, searchVideos } = this.props;

        if (query) {
            return searchVideos({
                query
            });
        }
    };

    reloadGrid = () =>
        this.setState({ mountGrid: false }, () => {
            this.props.clearSearch();
            this.setState({ mountGrid: true });
        });

    componentWillMount() {
        const { query } = this.props;

        this.props.setQuery(this.getQuery());
    }

    componentWillUnmount() {
        this.props.clearSearch();
    }

    componentDidUpdate({ query }) {
        const newQuery = this.getQuery();

        if (newQuery !== query) {
            this.reloadGrid();
        }
    }

    render() {
        const {
            state: { mountGrid },
            props: {
                query,
                items,
                queueAndPlayItem,
                queueItem,
                editPlaylistItem
            },
            loadContent
        } = this;

        return query && mountGrid ? (
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
        ) : null;
    }
}

const mapStateToProps = (
    { search: { items } },
    {
        match: {
            params: { query = '' }
        }
    }
) => ({
    query,
    items
});

const mapDispatchToProps = (dispatch) => ({
    setQuery: (query) =>
        dispatch({ type: 'search/SET_QUERY', data: { query } }),

    searchVideos: (params) => dispatch(searchVideos(params)),

    clearSearch: () => dispatch({ type: 'search/RESET' }),

    queueItem: (data) => dispatch({ type: 'QUEUE_PUSH', items: [data] }),

    queueAndPlayItem: (data) => {
        dispatch({ type: 'QUEUE_PUSH', items: [data] });
        dispatch({
            type: 'QUEUE_SET_ACTIVE_ITEM'
        });
    },

    editPlaylistItem: (data) => dispatch(editPlaylistItem(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);
