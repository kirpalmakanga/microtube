import { FunctionComponent } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';

import { YoutubePlayer, Options } from './YoutubePlayer';
import Placeholder from '../Placeholder';

const playerOptions: Options = {
    playerVars: {
        modestbranding: 1,
        iv_load_policy: 3,
        controls: 0,
        autoplay: 1
    }
};

interface Props {
    videoId: string;
    onReady: (playerInstance: YouTubePlayer) => void;
    onBuffering: () => void;
    onPlay: () => void;
    onPause: () => void;
    onEnd: () => void;
    onStateChange: (playbackStateId: number) => void;
    onTimeUpdate: (t: number | undefined) => void;
    onLoadingUpdate: (t: number | undefined) => void;
}

const Screen: FunctionComponent<Props> = ({
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
}) => (
    <div className="screen" {...props}>
        {videoId ? (
            <YoutubePlayer
                videoId={videoId}
                options={playerOptions}
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
        ) : (
            <Placeholder icon="screen" text="No video." />
        )}
    </div>
);

export default Screen;
