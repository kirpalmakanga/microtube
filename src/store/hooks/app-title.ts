import { useLocation } from 'solid-app-router';
import { useStore } from '..';

export default () => {
    const { pathname } = useLocation();
    const [
        {
            playlistItems: { playlistTitle },
            channel: { channelTitle }
        }
    ] = useStore();

    let title = 'MicroTube';

    if (pathname.startsWith('/subscriptions')) {
        title = 'Subscriptions';
    }

    if (pathname.startsWith('/channel')) {
        title = channelTitle;
    }

    if (pathname.startsWith('/playlist')) {
        title = playlistTitle;
    }

    return title;
};
