import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getChannelVideos, editPlaylistItem } from '../../actions/youtube';

import List from '../../components/List';
import VideoCard from '../../components/cards/VideoCard';

class ChannelVideos extends Component {
    componentWillUnmount() {
        this.props.clearItems();
    }

    render() {
        const {
            props: {
                items,
                loadContent,
                queueAndPlayItem,
                queueItem,
                editPlaylistItem
            }
        } = this;

        return (
            <List
                items={items}
                loadMoreItems={loadContent}
                renderItem={({ data }) => {
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

const mapStateToProps = ({ channel: { items } }) => ({
    items
});

const mapDispatchToProps = (
    dispatch,
    {
        match: {
            params: { channelId }
        }
    }
) => ({
    loadContent: () => dispatch(getChannelVideos({ channelId })),

    clearItems: () => dispatch({ type: 'channel/CLEAR_ITEMS' }),

    queueItem: (data) => dispatch({ type: 'player/QUEUE_PUSH', items: [data] }),

    queueAndPlayItem: (data) => {
        dispatch({ type: 'player/QUEUE_PUSH', items: [data] });
        dispatch({
            type: 'player/SET_ACTIVE_QUEUE_ITEM'
        });
    },

    editPlaylistItem: (data) => dispatch(editPlaylistItem(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChannelVideos);
