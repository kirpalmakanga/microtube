import { useLocation } from 'solid-app-router';
import { createMemo } from 'solid-js';
import { useStore } from '..';

export default () => {
    const location = useLocation();
    const [state] = useStore();

    const title = createMemo(() => {
        const { pathname } = location;
        let title = 'MicroTube';

        if (pathname.startsWith('/subscriptions')) {
            title = 'Subscriptions';
        }

        if (pathname.startsWith('/channel')) {
            title = state.channel.channelTitle;
        }

        if (pathname.startsWith('/playlist')) {
            title = state.playlistItems.playlistTitle;
        }

        if (pathname.startsWith('/video')) {
            title = state.player.video.title;
        }

        return title;
    }, location.pathname);

    return title;
};
