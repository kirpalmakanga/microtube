import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getPlaylistTitle,
    getPlaylistItems,
    removePlaylistItem,
    editPlaylistItem
} from '../actions/youtube';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import VideoCard from '../components/cards/VideoCard';

class Playlist extends Component {
    componentDidMount() {
        this.props.getPlaylistTitle(this.props.playlistId);
    }

    componentWillUnmount() {
        this.props.clearItems();
    }

    componentDidUpdate({ playlistId: previousPlaylistId }) {
        const { playlistId, clearItems } = this.props;

        if (playlistId !== previousPlaylistId) {
            clearItems();
        }
    }

    render() {
        const {
            playlistId,
            items,
            totalResults,
            loadContent,
            queueAndPlayItem,
            queueItem,
            removeItem,
            editPlaylistItem
        } = this.props;

        return totalResults === 0 ? (
            <Placeholder icon="empty" text="This playlist is empty." />
        ) : (
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
    { playlistItems: { playlistTitle, items, nextPageToken, totalResults } },
    {
        match: {
            params: { playlistId }
        }
    }
) => ({
    playlistId,
    playlistTitle,
    items,
    nextPageToken,
    totalResults
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

    queueItem: (data) => dispatch({ type: 'player/QUEUE_PUSH', items: [data] }),

    queueAndPlayItem: (data) => {
        dispatch({ type: 'player/QUEUE_PUSH', items: [data] });
        dispatch({
            type: 'player/SET_ACTIVE_QUEUE_ITEM'
        });
    },

    editPlaylistItem: (data) => dispatch(editPlaylistItem(data)),

    clearItems: () => dispatch({ type: 'playlist/CLEAR_ITEMS' })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlist);
