import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getPlaylistTitle,
    getPlaylistItems,
    removePlaylistItem,
    editPlaylistItem
} from '../actions/youtube';

import Grid from '../components/Grid';

import VideoCard from '../components/cards/VideoCard';

class Playlist extends Component {
    constructor(props) {
        super(props);

        props.clearItems();
    }

    componentDidMount() {
        this.props.getPlaylistTitle(this.props.playlistId);
    }

    render() {
        const {
            playlistId,
            items,
            nextPageToken,
            getPlaylistItems,
            queueAndPlayItem,
            queueItem,
            removeItem,
            editPlaylistItem
        } = this.props;

        return (
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
                            removeItem={() =>
                                removeItem({ ...data, playlistId })
                            }
                            editPlaylistItem={() => editPlaylistItem(data)}
                        />
                    );
                }}
            />
        );
    }
}

const mapStateToProps = (
    { playlistItems: { playlistTitle, items, nextPageToken } },
    {
        match: {
            params: { playlistId }
        }
    }
) => ({
    playlistId,
    playlistTitle,
    items,
    nextPageToken
});

const mapDispatchToProps = (dispatch) => ({
    getPlaylistTitle: (id) => dispatch(getPlaylistTitle(id)),

    getPlaylistItems: (params) => dispatch(getPlaylistItems(params)),

    removeItem: (data) => dispatch(removePlaylistItem(data)),

    queueItem: (data) => dispatch({ type: 'QUEUE_PUSH', data }),

    queueAndPlayItem: (data) => {
        dispatch({ type: 'QUEUE_PUSH', data });
        dispatch({
            type: 'QUEUE_SET_ACTIVE_ITEM'
        });
    },

    editPlaylistItem: (data) => dispatch(editPlaylistItem(data)),

    clearItems: () => dispatch({ type: 'playlist/CLEAR_ITEMS' })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlist);
