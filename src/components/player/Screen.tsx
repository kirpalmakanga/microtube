import { Component, Show } from 'solid-js';
import type { Options, YouTubePlayer } from 'youtube-player/dist/types';
import Placeholder from '../Placeholder';
import { Player } from './YouTubePlayer';

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
    isVisible: boolean;
    onReady: (playerInstance: YouTubePlayer) => void;
    onBuffering: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnd: () => void;
    onStateChange?: (playbackStateId: number) => void;
    onClick: () => void;
}

const Screen: Component<Props> = (props) => (
    <div className="screen" classList={{ 'is--visible': props.isVisible }}>
        <Show
            when={props.videoId}
            fallback={<Placeholder icon="screen" text="No video." />}
        >
            <Player
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
