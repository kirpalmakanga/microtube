import React, { PureComponent } from 'react';

import YoutubePlayer from '../YoutubePlayer';
import Icon from '../Icon';

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
        const { videoId, onReady, onEnd, onStateChange, ...props } = this.props;

        return (
            <div {...props}>
                <YoutubePlayer
                    videoId={videoId}
                    opts={playerOptions}
                    onReady={onReady}
                    onEnd={onEnd}
                    onStateChange={onStateChange}
                />
                {!videoId && (
                    <div className="screen__placeholder">
                        <Icon name="screen" />
                        <p className="screen__placeholder-text">No video.</p>
                    </div>
                )}
            </div>
        );
    }
}

export default Screen;
