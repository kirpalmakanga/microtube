import { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';
import { QueueItem } from '../../@types/alltypes';
import useAppTitle from '../store/hooks/app-title';
import { usePlayer } from '../store/hooks/player';

const Head: FunctionComponent = () => {
    let title = useAppTitle();
    const [{ queue, video, currentId }] = usePlayer();

    const { id: currentVideoId, title: currentVideoTitle } = video.id
        ? video
        : queue.find(({ id }: QueueItem) => id === currentId) || {};

    if (currentVideoId) {
        title = `Microtube | ${currentVideoTitle}`;
    }

    return <Helmet title={title} />;
};

export default Head;
