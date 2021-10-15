import { useLocation } from 'solid-app-router';
import { useStore } from '..';

export default () => {
    const location = useLocation();
    const [state] = useStore();

    let title = 'MicroTube';

    if (location.pathname.startsWith('/subscriptions')) {
        title = 'Subscriptions';
    }

    if (location.pathname.startsWith('/channel')) {
        title = state.channel.channelTitle;
    }

    if (location.pathname.startsWith('/playlist')) {
        title = state.playlistItems.playlistTitle;
    }

    return () => {
        let title = 'MicroTube';

        if (location.pathname.startsWith('/subscriptions')) {
            title = 'Subscriptions';
        }

        if (location.pathname.startsWith('/channel')) {
            title = state.channel.channelTitle;
        }

        if (location.pathname.startsWith('/playlist')) {
            title = state.playlistItems.playlistTitle;
        }

        return title;
    };
};
