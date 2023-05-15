import { Component } from 'solid-js';

interface Props {
    class?: string;
    name: string;
}

const Icon: Component<Props> = (props: Props) => (
    <span
        class="inline-block"
        classList={{ [props.class || '']: !!props.class }}
    >
        <svg class="fill-current w-full h-full">
            <use href={`#icon-${props.name}`} />
        </svg>
    </span>
);

export default Icon;
