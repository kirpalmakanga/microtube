import React, { Component } from 'react';
import { connect } from 'react-redux';

import { searchVideos } from '../actions/youtube';

import Screen from '../layout/Screen';

import Grid from '../components/Grid';

import VideoCard from '../components/cards/VideoCard';

class Search extends Component {
    state = {
        mountGrid: true
    };

    getQuery = () => this.props.query;

    loadContent = async () => {
        const query = this.getQuery();

        const { nextPageToken: pageToken, searchVideos, forMine } = this.props;

        if (query && pageToken !== null) {
            return searchVideos({
                query,
                pageToken,
                forMine
            });
        }
    };

    reloadGrid = () =>
        this.setState({ mountGrid: false }, () => {
            this.props.clearSearch();
            this.setState({ mountGrid: true });
        });

    componentWillMount() {
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
            props: { query, items, queueAndPlayItem, queueItem },
            loadContent
        } = this;

        return (
            <Screen>
                {query && mountGrid ? (
                    <Grid
                        items={items}
                        loadContent={loadContent}
                        renderItem={(data) => (
                            <VideoCard
                                {...data}
                                onClick={() => queueAndPlayItem(data)}
                                queueItem={() => queueItem(data)}
                            />
                        )}
                    />
                ) : null}
            </Screen>
        );
    }
}

const mapStateToProps = (
    { search: { items, nextPageToken, forMine } },
    {
        match: {
            params: { query = '' }
        }
    }
) => ({
    query,
    items,
    nextPageToken,
    forMine
});

const mapDispatchToProps = (dispatch) => ({
    setQuery: (query) =>
        dispatch({ type: 'search/SET_QUERY', data: { query } }),
    
    searchVideos: (params) => dispatch(searchVideos(params)),
    
    clearSearch: () => dispatch({ type: 'search/RESET' }),

    queueItem: (data) => dispatch({ type: 'QUEUE_PUSH', data }),
    
    queueAndPlayItem: (data) => {
        dispatch({ type: 'QUEUE_PUSH', data });
        dispatch({
            type: 'QUEUE_SET_ACTIVE_ITEM'
        });
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);
