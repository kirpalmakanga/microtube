import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePlayer } from '../store/hooks/player';

const Video = () => {
    const { videoId } = useParams();
    const [, { getVideo, clearVideo }] = usePlayer();

    useEffect(() => {
        getVideo(videoId);

        return clearVideo;
    }, [videoId]);

    return null;
};

export default Video;
