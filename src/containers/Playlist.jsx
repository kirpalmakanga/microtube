import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getPlaylistTitle,
    getPlaylistItems,
    clearPlaylistItems,
    queueItem,
    playItem,
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
        this.props.clearPlaylistItems();
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
            getPlaylistItems,
            playItem,
            queueItem,
            removePlaylistItem,
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
                            playItem={() => playItem(data)}
                            queueItem={() => queueItem(data)}
                            removeItem={() =>
                                removePlaylistItem({ ...data, playlistId })
                            }
                            editPlaylistItem={() => editPlaylistItem(data)}
                        />
                    );
                }}
                loadMoreItems={() => getPlaylistItems({ playlistId })}
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

const mapDispatchToProps = {
    getPlaylistTitle,
    getPlaylistItems,
    clearPlaylistItems,
    editPlaylistItem,
    removePlaylistItem,
    queueItem,
    playItem
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlist);
