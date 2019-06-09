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
            getSubscriptions,
            subscribeToChannel,
            unsubscribeFromChannel
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
                loadMoreItems={getSubscriptions}
                renderItem={({ data }) => {
                    const { id, title, subscriptionId } = data;

                    return (
                        <ChannelCard
                            {...data}
                            subscribe={() => subscribeToChannel(id)}
                            unsubscribe={() =>
                                unsubscribeFromChannel(subscriptionId, title)
                            }
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

const mapDispatchToProps = {
    getSubscriptions,
    subscribeToChannel,
    unsubscribeFromChannel
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Subscriptions);
