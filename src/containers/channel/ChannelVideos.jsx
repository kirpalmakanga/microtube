import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getChannelVideos, editPlaylistItem } from '../../actions/youtube';

import Grid from '../../components/Grid';
import VideoCard from '../../components/cards/VideoCard';

class ChannelVideos extends Component {
    componentWillUnmount() {
        this.props.clearItems();
    }

    render() {
        const {
            props: {
                channelId,
                items,
                nextPageToken: pageToken,
                getChannelVideos,
                queueAndPlayItem,
                queueItem,
                editPlaylistItem
            }
        } = this;

        return (
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
    getChannelVideos: (params) => dispatch(getChannelVideos(params)),

    clearItems: () => dispatch({ type: 'channel/CLEAR_ITEMS' }),

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
)(ChannelVideos);
