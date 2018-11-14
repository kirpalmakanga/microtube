import React, { Component } from 'react';
import { connect } from 'react-redux';

import { searchVideos } from '../actions/youtube';

import Screen from '../layout/Screen';

import Grid from '../components/Grid';

import VideoCard from '../components/cards/VideoCard';

class Search extends Component {
    getQuery = () => this.props.match.params.query;

    loadContent = (newQuery) => {
        const query = this.getQuery();

        const { nextPageToken, searchVideos, forMine } = this.props;

        if (query && nextPageToken !== null) {
            searchVideos({
                query: newQuery || query,
                pageToken: newQuery ? '' : nextPageToken,
                forMine
            });
        }
    };

    componentWillReceiveProps({
        match: {
            params: { query }
        }
    }) {
        if (query !== this.getQuery()) {
            console.log('search');
            this.loadContent(query);
        }
    }

    componentWillMount() {
        this.loadContent(this.getQuery());
    }

    componentWillUnmount() {
        this.props.clearSearch();
    }

    render() {
        const { items, setAsActiveItem, pushToQueue } = this.props;

        return (
            <Screen>
                {items.length ? (
                    <Grid
                        items={items}
                        loadContent={this.loadContent}
                        renderItem={(data) => {
                            return (
                                <VideoCard
                                    {...data}
                                    onClick={() => setAsActiveItem(data)}
                                    pushToQueue={() => pushToQueue(data)}
                                />
                            );
                        }}
                    />
                ) : null}
            </Screen>
        );
    }
}

const mapStateToProps = ({ search: { items, nextPageToken, forMine } }) => ({
    items,
    nextPageToken,
    forMine
});

const mapDispatchToProps = (dispatch) => ({
    searchVideos: (params) => dispatch(searchVideos(params)),
    clearSearch: () => dispatch({ type: 'CLEAR_SEARCH' }),
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
