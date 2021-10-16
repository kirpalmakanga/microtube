import { useLocation } from 'solid-app-router';
import { useStore } from '..';

export default () => {
    const location = useLocation();
    const [state] = useStore();

    return () => {
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
    };
};
