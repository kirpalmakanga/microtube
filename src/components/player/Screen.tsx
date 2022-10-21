import { Component, Show } from 'solid-js';
import Placeholder from '../Placeholder';
import { Player } from './YouTubePlayer';
import { Options, YouTubePlayer } from '../../api/youtube-player';

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
    isFullscreen: boolean;
    onReady: (playerInstance: YouTubePlayer) => void;
    onBuffering: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnd: () => void;
    onStateChange?: (playbackStateId: number) => void;
    onClick?: () => void;
}

const Screen: Component<Props> = (props) => (
    <div
        class="fixed left-0 right-0 flex bg-primary-700 transition-opacity"
        classList={{
            'top-12 bottom-12': !props.isFullscreen,
            'top-0 bottom-0': props.isFullscreen,
            'opacity-0 invisible': !props.isVisible,
            'opacity-100 visible': props.isVisible,
            '': !!props.videoId
        }}
        onClick={props.onClick}
    >
        <Show
            when={props.videoId}
            fallback={<Placeholder icon="screen" text="No video." />}
        >
            <Player
                class="relative flex-grow after:(content-DEFAULT absolute inset-0) children:(w-full h-full)"
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
