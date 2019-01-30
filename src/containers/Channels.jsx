import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getSubscriptions,
    subscribeToChannel,
    unsubscribeFromChannel
} from '../actions/youtube';

import Grid from '../components/Grid';

import ChannelCard from '../components/cards/ChannelCard';

class Subscriptions extends Component {
    render() {
        const {
            items,
            nextPageToken,
            getSubscriptions,
            makeSubscribeToChannel,
            makeUnsubscribeFromChannel
        } = this.props;

        return (
            <Grid
                items={items}
                loadContent={() =>
                    nextPageToken !== null &&
                    getSubscriptions({
                        mine: true,
                        pageToken: nextPageToken
                    })
                }
                renderItem={(data) => {
                    const { id, subscriptionId } = data;

                    return (
                        <ChannelCard
                            {...data}
                            subscribe={makeSubscribeToChannel(id)}
                            unsubscribe={makeUnsubscribeFromChannel(
                                subscriptionId
                            )}
                        />
                    );
                }}
            />
        );
    }
}

const mapStateToProps = ({ subscriptions: { items, nextPageToken } }) => ({
    items,
    nextPageToken
});

const mapDispatchToProps = (dispatch) => ({
    getSubscriptions: (params) => dispatch(getSubscriptions(params)),

    makeSubscribeToChannel: (id) => () => dispatch(subscribeToChannel(id)),

    makeUnsubscribeFromChannel: (id) => () =>
        dispatch(unsubscribeFromChannel(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Subscriptions);
