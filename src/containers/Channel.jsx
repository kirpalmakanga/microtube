import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getChannelVideos } from '../actions/youtube';

import Screen from '../layout/Screen';

import Grid from '../components/Grid';

import VideoCard from '../components/cards/VideoCard';

class Channel extends Component {
    componentWillUnmount() {
        this.props.clearChannelVideos();
    }

    render() {
        const {
            channelId,
            items,
            nextPageToken: pageToken,
            getChannelVideos,
            setAsActiveItem,
            pushToQueue
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
                                onClick={() => setAsActiveItem(data)}
                                pushToQueue={() => pushToQueue(data)}
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
    getChannelVideos: (params) => dispatch(getChannelVideos(params)),
    clearChannelVideos: () => dispatch({ type: 'channel/CLEAR' }),
    setAsActiveItem: (video) =>
        dispatch({
            type: 'QUEUE_SET_ACTIVE_ITEM',
            data: { video }
        }),

    pushToQueue: (data) => dispatch({ type: 'QUEUE_PUSH', data })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Channel);
