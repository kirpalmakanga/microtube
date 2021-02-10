import { FunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { QueueItem } from '../../@types/alltypes';
import { useStore } from '../store';

const Head: FunctionComponent = () => {
    const { pathname } = useLocation();

    const [
        {
            playlistItems: { playlistTitle },
            channel: { channelTitle },
            player: { queue, video, currentId }
        }
    ] = useStore();

    const { id: currentVideoId, title: currentVideoTitle } = video.id
        ? video
        : queue.find(({ id }: QueueItem) => id === currentId) || {};

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

    if (currentVideoId) {
        title = `Microtube | ${currentVideoTitle}`;
    }

    return <Helmet title={title} />;
};

export default Head;
