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

    loadContent = () => {
        const query = this.getQuery();

        const { nextPageToken: pageToken, searchVideos, forMine } = this.props;

        if (query && pageToken !== null) {
            searchVideos({
                query,
                pageToken,
                forMine
            });
        }
    };

    componentWillMount() {
        this.props.setQuery(this.getQuery());
    }

    componentWillUnmount() {
        this.props.clearSearch();
    }

    componentDidUpdate({ query }) {
        const newQuery = this.getQuery();

        if (newQuery !== query) {
            this.setState({ mountGrid: false }, () => {
                this.props.clearSearch();
                this.setState({ mountGrid: true });
            });
        }
    }

    render() {
        const {
            state: { mountGrid },
            props: { items, setAsActiveItem, pushToQueue },
            loadContent
        } = this;

        return (
            <Screen>
                {mountGrid ? (
                    <Grid
                        items={items}
                        loadContent={loadContent}
                        renderItem={(data) => (
                            <VideoCard
                                {...data}
                                onClick={() => setAsActiveItem(data)}
                                pushToQueue={() => pushToQueue(data)}
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
    setQuery: (query) => dispatch({ type: 'SET_QUERY', data: { query } }),
    searchVideos: (params) => dispatch(searchVideos(params)),
    clearSearch: () => dispatch({ type: 'RESET_SEARCH' }),
    setAsActiveItem: (video) =>
        dispatch({
            type: 'QUEUE_SET_ACTIVE_ITEM',
            data: { video }
        }),

    pushToQueue: (data) => dispatch({ type: 'QUEUE_PUSH', data })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);
