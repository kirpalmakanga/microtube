import { Component } from 'react';
import { connect } from 'react-redux';
import { getVideo, clearVideo } from '../actions/youtube';

class Video extends Component {
    loadVideo = () => {
        const { videoId, getVideo } = this.props;

        getVideo(videoId);
    };

    componentDidMount() {
        this.loadVideo();
    }

    componentWillUnmount() {
        this.props.clearVideo();
    }

    componentDidUpdate({ videoId: previousVideoId }) {
        const { videoId } = this.props;

        if (videoId !== previousVideoId) {
            this.loadVideo();
        }
    }

    render() {
        return null;
    }
}

const mapStateToProps = (
    _,
    {
        match: {
            params: { videoId }
        }
    }
) => ({
    videoId
});

const mapDispatchToProps = {
    getVideo,
    clearVideo
};

export default connect(mapStateToProps, mapDispatchToProps)(Video);
