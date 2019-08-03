import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { formatTime } from '../lib/helpers';

class Head extends Component {
    getTitle = () => {
        const {
            location: { pathname },
            channelTitle,
            playlistTitle,
            currentTime,
            currentVideo: { id: videoId, title: currentVideoTitle, duration }
        } = this.props;

        let title = 'MicroTube';

        if (pathname.includes('/subscriptions')) {
            title = 'Subscriptions';
        }

        if (pathname.includes('/channel')) {
            title = channelTitle;
        }

        if (pathname.includes('/playlist')) {
            title = playlistTitle;
        }

        if (videoId) {
            title = `Microtube | ${currentVideoTitle} - ${formatTime(
                currentTime
            )} / ${formatTime(duration)}`;
        }

        return title;
    };

    render() {
        return <Helmet title={this.getTitle()} />;
    }
}

const mapStateToProps = ({
    playlistItems: { playlistTitle },
    channel: { channelTitle },
    player: { queue, currentTime }
}) => {
    const currentVideo = queue.find(({ active }) => active) || {};

    return {
        playlistTitle,
        channelTitle,
        currentTime,
        currentVideo
    };
};
export default withRouter(connect(mapStateToProps)(Head));
