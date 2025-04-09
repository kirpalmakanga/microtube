import { Component } from 'solid-js';

interface Props {
    class: string;
    isAnimated?: boolean;
}

const SoundWaveIcon: Component<Props> = (props) => (
    <span classList={{ [props.class || '']: !!props.class }}>
        <svg
            class="wave fill-current w-full h-full"
            classList={{ 'is--animated': props.isAnimated }}
            viewBox="0 0 24 24"
        >
            <rect class="eq-bar eq-bar--1" x="4" y="4" width="3.7" height="8" />
            <rect
                class="eq-bar eq-bar--2"
                x="10.2"
                y="4"
                width="3.7"
                height="16"
            />
            <rect
                class="eq-bar eq-bar--3"
                x="16.3"
                y="4"
                width="3.7"
                height="11"
            />
        </svg>
    </span>
);

export default SoundWaveIcon;
