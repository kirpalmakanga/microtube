import { useParams } from 'solid-app-router';
import { Component, onCleanup, onMount } from 'solid-js';
import { usePlayer } from '../store/player';

const Video: Component = () => {
    const params = useParams();
    const [, { getVideo, clearVideo }] = usePlayer();

    onMount(() => getVideo(params.videoId));

    onCleanup(clearVideo);

    return null;
};

export default Video;
