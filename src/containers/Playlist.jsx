import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getPlaylistTitle,
    getPlaylistItems,
    removePlaylistItem,
    editPlaylistItem
} from '../actions/youtube';

import List from '../components/List';

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
            loadContent,
            queueAndPlayItem,
            queueItem,
            removeItem,
            editPlaylistItem
        } = this.props;

        return (
            <List
                items={items}
                renderItem={({ data }) => {
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
                loadMoreItems={loadContent}
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

const mapDispatchToProps = (
    dispatch,
    {
        match: {
            params: { playlistId }
        }
    }
) => ({
    getPlaylistTitle: (id) => dispatch(getPlaylistTitle(id)),

    loadContent: () => dispatch(getPlaylistItems({ playlistId })),

    removeItem: (data) => dispatch(removePlaylistItem(data)),

    queueItem: (data) => dispatch({ type: 'QUEUE_PUSH', items: [data] }),

    queueAndPlayItem: (data) => {
        dispatch({ type: 'QUEUE_PUSH', items: [data] });
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
