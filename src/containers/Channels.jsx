import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getSubscriptions } from '../actions/youtube';

import Grid from '../components/Grid';

import ChannelCard from '../components/cards/ChannelCard';

class Subscriptions extends Component {
    render() {
        const { items, nextPageToken, getSubscriptions } = this.props;

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
                renderItem={(props) => <ChannelCard {...props} />}
            />
        );
    }
}

const mapStateToProps = ({ subscriptions: { items, nextPageToken } }) => ({
    items,
    nextPageToken
});

const mapDispatchToProps = (dispatch) => ({
    getSubscriptions: (params) => dispatch(getSubscriptions(params))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Subscriptions);
