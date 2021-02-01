import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getVideo, clearVideo } from '../store/actions/youtube';

const Video = () => {
    const { videoId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getVideo(videoId));

        return () => dispatch(clearVideo());
    }, [videoId]);

    return null;
};

export default Video;
