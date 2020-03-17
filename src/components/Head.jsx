import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { formatTime } from '../lib/helpers';

const Head = ({
    channelTitle,
    playlistTitle,
    currentTime,
    currentVideo: { id: videoId, title: currentVideoTitle, duration }
}) => {
    const { pathname } = useLocation();

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

    return <Helmet title={title} />;
};

const mapStateToProps = ({
    playlistItems: { playlistTitle },
    channel: { channelTitle },
    player: { queue, video, currentId, currentTime }
}) => {
    const currentVideo = video.id
        ? video
        : queue.find(({ id }) => id === currentId) || {};

    return {
        playlistTitle,
        channelTitle,
        currentTime,
        currentVideo
    };
};
export default connect(mapStateToProps)(Head);
