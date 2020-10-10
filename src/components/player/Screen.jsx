import { PureComponent } from 'react';

import YoutubePlayer from './YoutubePlayer';
import Placeholder from '../Placeholder';

const playerOptions = {
    playerVars: {
        autohide: 1,
        modestbranding: 1,
        iv_load_policy: 3,
        controls: 0,
        showinfo: 0
    }
};

class Screen extends PureComponent {
    render() {
        const {
            videoId,
            onReady,
            onBuffering,
            onPlay,
            onPause,
            onEnd,
            onStateChange,
            onTimeUpdate,
            onLoadingUpdate,
            ...props
        } = this.props;

        return (
            <div {...props}>
                <YoutubePlayer
                    videoId={videoId}
                    opts={playerOptions}
                    onReady={onReady}
                    onEnd={onEnd}
                    onTimeUpdate={onTimeUpdate}
                    onLoadingUpdate={onLoadingUpdate}
                    onPlay={onPlay}
                    onPause={onPause}
                    onBuffering={onBuffering}
                    onStateChange={onStateChange}
                    onError={(err) => console.error(err)}
                />
                {!videoId && <Placeholder icon="screen" text="No video." />}
            </div>
        );
    }
}

export default Screen;
