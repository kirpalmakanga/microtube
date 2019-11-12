import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getChannelVideos,
    clearChannelVideos,
    queueItem,
    playItem,
    editPlaylistItem,
    removePlaylistItem
} from '../../actions/youtube';

import List from '../../components/List';
import Placeholder from '../../components/Placeholder';
import VideoCard from '../../components/cards/VideoCard';

import Menu from '../../components/menu/Menu';
import MenuItem from '../../components/menu/MenuItem';

class ChannelVideos extends Component {
    state = { isMenuOpen: false, videoData: {} };

    openMenu = (videoData) => this.setState({ isMenuOpen: true, videoData });

    closeMenu = () => this.setState({ isMenuOpen: false, videoData: {} });

    componentWillUnmount() {
        this.props.clearChannelVideos();
    }

    render() {
        const {
            props: {
                channelId,
                items,
                totalResults,
                getChannelVideos,
                queueItem,
                playItem,
                editPlaylistItem
            },
            state: { isMenuOpen, videoData },
            openMenu,
            closeMenu
        } = this;

        const { id: videoId, title: videoTitle } = videoData;

        return (
            <>
                {totalResults === 0 ? (
                    <Placeholder
                        icon="empty"
                        text="This channel hasn't uploaded videos."
                    />
                ) : (
                    <List
                        items={items}
                        loadMoreItems={() => getChannelVideos({ channelId })}
                        itemKey={(index, data) => data[index].id}
                        renderItem={({ data }) => (
                            <VideoCard
                                {...data}
                                onClick={() => playItem(data)}
                                onClickMenu={() => openMenu(data)}
                            />
                        )}
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
                </Menu>
            </>
        );
    }
}

const mapStateToProps = (
    { channel: { items, totalResults } },
    {
        match: {
            params: { channelId }
        }
    }
) => ({
    channelId,
    items,
    totalResults
});

const mapDispatchToProps = {
    getChannelVideos,
    clearChannelVideos,
    editPlaylistItem,
    removePlaylistItem,
    queueItem,
    playItem
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelVideos);
