import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getSubscriptions,
    subscribeToChannel,
    unsubscribeFromChannel
} from '../actions/youtube';

import List from '../components/List';

import ChannelCard from '../components/cards/ChannelCard';

class Subscriptions extends Component {
    render() {
        const {
            items,
            loadContent,
            makeSubscribeToChannel,
            makeUnsubscribeFromChannel
        } = this.props;

        return (
            <List
                items={items}
                loadMoreItems={loadContent}
                renderItem={({ data }) => {
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

const mapStateToProps = ({ subscriptions: { items } }) => ({
    items
});

const mapDispatchToProps = (dispatch) => ({
    loadContent: () => dispatch(getSubscriptions()),

    makeSubscribeToChannel: (id) => () => dispatch(subscribeToChannel(id)),

    makeUnsubscribeFromChannel: (id) => () =>
        dispatch(unsubscribeFromChannel(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Subscriptions);
