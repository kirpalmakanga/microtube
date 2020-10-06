import { useEffect } from './Channel/react';
import { useDispatch } from './Channel/react-redux';
import { useParams } from './Channel/react-router-dom';

import { getVideo, clearVideo } from '../actions/youtube';

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
