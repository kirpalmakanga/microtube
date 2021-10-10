import { Component } from 'solid-js';
import { Title } from 'solid-meta';
import { QueueItem } from '../../@types/alltypes';
import useAppTitle from '../store/hooks/app-title';
import { usePlayer } from '../store/hooks/player';

const Head: Component = () => {
    let title = useAppTitle();
    const [{ queue, video, currentId }] = usePlayer();

    const { id: currentVideoId, title: currentVideoTitle } = video.id
        ? video
        : queue.find(({ id }: QueueItem) => id === currentId) || {};

    if (currentVideoId) {
        title = `Microtube | ${currentVideoTitle}`;
    }

    return <Title>{title}</Title>;
};

export default Head;
