import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

const Head = () => {
    const { pathname } = useLocation();

    const {
        channelTitle,
        playlistTitle,
        currentVideo: { id: videoId, title: currentVideoTitle }
    } = useSelector(
        ({
            playlistItems: { playlistTitle },
            channel: { channelTitle },
            player: { queue, video, currentId }
        }) => {
            const currentVideo = video.id
                ? video
                : queue.find(({ id }) => id === currentId) || {};

            return {
                playlistTitle,
                channelTitle,
                currentVideo
            };
        }
    );

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
        title = `Microtube | ${currentVideoTitle}`;
    }

    return <Helmet title={title} />;
};

export default Head;
