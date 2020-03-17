import { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getVideo, clearVideo } from '../actions/youtube';

const Video = ({ getVideo, clearVideo }) => {
    const { videoId } = useParams();

    useEffect(() => {
        getVideo(videoId);

        return clearVideo;
    }, [videoId]);

    return null;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    getVideo,
    clearVideo
};

export default connect(mapStateToProps, mapDispatchToProps)(Video);
