import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getSubscriptions,
    subscribeToChannel,
    unsubscribeFromChannel
} from '../actions/youtube';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import ChannelCard from '../components/cards/ChannelCard';

class Subscriptions extends Component {
    render() {
        const {
            items,
            totalResults,
            loadContent,
            makeSubscribeToChannel,
            makeUnsubscribeFromChannel
        } = this.props;

        return totalResults === 0 ? (
            <Placeholder
                icon="empty"
                text="You haven't subscribed to any channel yet."
            />
        ) : (
            <List
                className="channels"
                items={items}
                loadMoreItems={loadContent}
                renderItem={({ data }) => {
                    const { id, title, subscriptionId } = data;

                    return (
                        <ChannelCard
                            {...data}
                            subscribe={makeSubscribeToChannel(id)}
                            unsubscribe={makeUnsubscribeFromChannel(
                                subscriptionId,
                                title
                            )}
                        />
                    );
                }}
            />
        );
    }
}

const mapStateToProps = ({ subscriptions: { items, totalResults } }) => ({
    items,
    totalResults
});

const mapDispatchToProps = (dispatch) => ({
    loadContent: () => dispatch(getSubscriptions()),

    makeSubscribeToChannel: (id) => () => dispatch(subscribeToChannel(id)),

    makeUnsubscribeFromChannel: (...params) => () =>
        dispatch(unsubscribeFromChannel(...params))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Subscriptions);
