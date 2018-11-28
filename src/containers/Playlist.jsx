import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getPlaylistItems, removePlaylistItem } from '../actions/youtube';

import Screen from '../layout/Screen';

import Grid from '../components/Grid';

import VideoCard from '../components/cards/VideoCard';

class Playlist extends Component {
    componentWillUnmount() {
        this.props.clearItems();
    }

    render() {
        const {
            playlistId,
            items,
            nextPageToken,
            getPlaylistItems,
            queueAndPlayItem,
            queueItem,
            removeItem
        } = this.props;

        return (
            <Screen>
                <Grid
                    items={items}
                    loadContent={() =>
                        nextPageToken !== null &&
                        getPlaylistItems({
                            playlistId,
                            pageToken: nextPageToken
                        })
                    }
                    renderItem={(data) => {
                        return (
                            <VideoCard
                                {...data}
                                onClick={() => queueAndPlayItem(data)}
                                queueItem={() => queueItem(data)}
                                removeItem={() => removeItem(data)}
                            />
                        );
                    }}
                />
            </Screen>
        );
    }
}

const mapStateToProps = (
    { playlistItems: { items, nextPageToken } },
    {
        match: {
            params: { playlistId }
        }
    }
) => ({
    playlistId,
    items,
    nextPageToken
});

const mapDispatchToProps = (dispatch) => ({
    getPlaylistItems: (params) => dispatch(getPlaylistItems(params)),

    removeItem: (data) => dispatch(removePlaylistItem(data)),

    queueItem: (data) => dispatch({ type: 'QUEUE_PUSH', data }),

    queueAndPlayItem: (data) => {
        dispatch({ type: 'QUEUE_PUSH', data });
        dispatch({
            type: 'QUEUE_SET_ACTIVE_ITEM'
        });
    },

    clearItems: () => dispatch({ type: 'playlist/CLEAR_ITEMS' })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlist);
