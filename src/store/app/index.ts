import { createMemo } from 'solid-js';
import { useLocation } from '@solidjs/router';
import { useStore } from '..';

export const useAppTitle = () => {
    const location = useLocation();
    const [state] = useStore();

    return createMemo(() => {
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
    });
};
