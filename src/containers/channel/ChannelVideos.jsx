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

class ChannelVideos extends Component {
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
            }
        } = this;

        return totalResults === 0 ? (
            <Placeholder
                icon="empty"
                text="This channel hasn't uploaded videos."
            />
        ) : (
            <List
                items={items}
                loadMoreItems={() => getChannelVideos({ channelId })}
                itemKey={(index, data) => data[index].id}
                renderItem={({ data }) => {
                    return (
                        <VideoCard
                            {...data}
                            playItem={() => playItem(data)}
                            queueItem={() => queueItem(data)}
                            editPlaylistItem={() => editPlaylistItem(data.id)}
                        />
                    );
                }}
            />
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChannelVideos);
