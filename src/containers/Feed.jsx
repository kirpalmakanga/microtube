import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getFeed } from '../actions/youtube';

import Screen from '../layout/Screen';

import Grid from '../components/Grid';

import VideoCard from '../components/cards/VideoCard';

class Feed extends Component {
    componentWillUnmount() {
        this.props.clearFeed();
    }

    render() {
        const { items, getFeed } = this.props;

        return (
            <Screen>
                <Grid
                    items={items}
                    loadContent={getFeed}
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

const mapStateToProps = ({ feed: { items } }) => ({ items });

const mapDispatchToProps = (dispatch) => ({
    getFeed: () => dispatch(getFeed()),
    clearFeed: () => dispatch({ type: 'CLEAR_FEED' }),
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
)(Feed);
