import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getChannelTitle,
    getChannelVideos,
    editPlaylistItem
} from '../actions/youtube';

import Screen from '../layout/Screen';

import Grid from '../components/Grid';

import VideoCard from '../components/cards/VideoCard';

class Channel extends Component {
    componentDidMount() {
        this.props.getChannelTitle(this.props.channelId);
    }

    componentWillUnmount() {
        this.props.clearChannelVideos();
    }

    render() {
        const {
            channelId,
            items,
            nextPageToken: pageToken,
            getChannelVideos,
            queueAndPlayItem,
            queueItem,
            editPlaylistItem
        } = this.props;

        return (
            <Screen>
                <Grid
                    items={items}
                    loadContent={() =>
                        pageToken !== null &&
                        getChannelVideos({
                            channelId,
                            pageToken
                        })
                    }
                    renderItem={(data) => {
                        return (
                            <VideoCard
                                {...data}
                                onClick={() => queueAndPlayItem(data)}
                                queueItem={() => queueItem(data)}
                                editPlaylistItem={() => editPlaylistItem(data)}
                            />
                        );
                    }}
                />
            </Screen>
        );
    }
}

const mapStateToProps = (
    { channel: { items, nextPageToken } },
    {
        match: {
            params: { channelId }
        }
    }
) => ({
    channelId,
    items,
    nextPageToken
});

const mapDispatchToProps = (dispatch) => ({
    getChannelTitle: (id) => dispatch(getChannelTitle(id)),

    getChannelVideos: (params) => dispatch(getChannelVideos(params)),

    clearChannelVideos: () => dispatch({ type: 'channel/CLEAR' }),

    queueItem: (data) => dispatch({ type: 'QUEUE_PUSH', data }),

    queueAndPlayItem: (data) => {
        dispatch({ type: 'QUEUE_PUSH', data });
        dispatch({
            type: 'QUEUE_SET_ACTIVE_ITEM'
        });
    },

    editPlaylistItem: (data) => dispatch(editPlaylistItem(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Channel);
