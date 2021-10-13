import { Component, Show } from 'solid-js';
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
    onPlay?: () => void;
    onPause?: () => void;
    onEnd: () => void;
    onStateChange?: (playbackStateId: number) => void;
    onClick: () => void;
}

const Screen: Component<Props> = (props) => (
    <div className="screen">
        <Show
            when={props.videoId}
            fallback={<Placeholder icon="screen" text="No video." />}
        >
            <YoutubePlayer
                videoId={props.videoId}
                options={playerOptions}
                onReady={props.onReady}
                onEnd={props.onEnd}
                onPlay={props.onPlay}
                onPause={props.onPause}
                onBuffering={props.onBuffering}
                onStateChange={props.onStateChange}
                onError={(err) => console.error(err)}
            />
        </Show>
    </div>
);

export default Screen;
