import { onMount, onCleanup, Component } from 'solid-js';

import { useParams } from 'solid-app-router';
import { usePlayer } from '../store/hooks/player';

const Video: Component = () => {
    const params = useParams();
    const [, { getVideo, clearVideo }] = usePlayer();

    onMount(() => getVideo(params.videoId));

    onCleanup(clearVideo);

    return null;
};

export default Video;
