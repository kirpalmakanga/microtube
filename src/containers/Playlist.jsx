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

import Menu from '../components/menu/Menu';
import MenuItem from '../components/menu/MenuItem';

class Playlist extends Component {
    state = { isMenuOpen: false, videoData: {} };

    openMenu = (videoData) => this.setState({ isMenuOpen: true, videoData });

    closeMenu = () => this.setState({ isMenuOpen: false, videoData: {} });

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
            props: {
                playlistId,
                items,
                totalResults,
                getPlaylistItems,
                playItem,
                queueItem,
                removePlaylistItem,
                editPlaylistItem
            },
            state: { isMenuOpen, videoData },
            openMenu,
            closeMenu
        } = this;

        const { id: videoId, title: videoTitle, playlistItemId } = videoData;

        return (
            <>
                {totalResults === 0 ? (
                    <Placeholder icon="empty" text="This playlist is empty." />
                ) : (
                    <List
                        items={items}
                        itemKey={(index, data) => data[index].id}
                        renderItem={({ data }) => (
                            <VideoCard
                                {...data}
                                onClick={() => playItem(data)}
                                onClickMenu={() => openMenu(data)}
                            />
                        )}
                        loadMoreItems={() => getPlaylistItems(playlistId)}
                    />
                )}

                <Menu isVisible={isMenuOpen} onClick={closeMenu}>
                    <MenuItem
                        title={`Add ${videoTitle} to queue`}
                        icon="queue"
                        onClick={() => queueItem(videoData)}
                    />

                    <MenuItem
                        title={`Add ${videoTitle} to playlist`}
                        icon="playlist-add"
                        onClick={() => editPlaylistItem(videoId)}
                    />

                    <MenuItem
                        title={`Remove ${videoTitle} from playlist`}
                        icon="delete"
                        onClick={() =>
                            removePlaylistItem(
                                playlistItemId,
                                playlistId,
                                videoTitle
                            )
                        }
                    />
                </Menu>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
