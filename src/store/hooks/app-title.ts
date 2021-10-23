import { useLocation } from 'solid-app-router';
import { createMemo } from 'solid-js';
import { useStore } from '..';

export default () => {
    const location = useLocation();
    const [state] = useStore();

    const title = createMemo(() => {
        const { pathname } = location;
        const {
            channel: { channelTitle },
            playlistItems: { playlistTitle },
            player: {
                video: { title: videoTitle }
            }
        } = state;
        let title = 'MicroTube';

        if (pathname.startsWith('/subscriptions')) {
            title = 'Subscriptions';
        }

        if (pathname.startsWith('/channel') && channelTitle) {
            title = channelTitle;
        }

        if (pathname.startsWith('/playlist') && playlistTitle) {
            title = playlistTitle;
        }

        if (pathname.startsWith('/video') && videoTitle) {
            title = videoTitle;
        }

        return title;
    }, location.pathname);

    return title;
};
