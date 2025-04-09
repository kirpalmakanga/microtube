import { Component, Show, splitProps } from 'solid-js';
import Placeholder from '../Placeholder';
import { YoutubePlayer } from './YouTubePlayer';
import { Options, YouTubePlayerInstance } from '../../api/youtube-player';

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
    onReady: (playerInstance: YouTubePlayerInstance) => void;
    onBuffering: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnd: () => void;
    onStateChange?: (playbackStateId: number) => void;
    onClick?: () => void;
}

const Screen: Component<Props> = (props) => {
    const [playerProps, screenProps] = splitProps(props, [
        'videoId',
        'onReady',
        'onEnd',
        'onBuffering',
        'onPlay',
        'onPause',
        'onStateChange'
    ]);

    return (
        <div
            class="fixed left-0 right-0 flex bg-primary-700 transition-opacity"
            classList={{
                'top-12 bottom-12': !screenProps.isFullscreen,
                'top-0 bottom-0': screenProps.isFullscreen,
                'opacity-0 invisible': !screenProps.isVisible,
                'opacity-100 visible': screenProps.isVisible
            }}
            onClick={screenProps.onClick}
        >
            <Show
                when={playerProps.videoId}
                fallback={<Placeholder icon="screen" text="No video." />}
            >
                <YoutubePlayer
                    class="relative flex-grow after:(content-DEFAULT absolute inset-0) children:(w-full h-full)"
                    options={playerOptions}
                    {...playerProps}
                />
            </Show>
        </div>
    );
};

export default Screen;
