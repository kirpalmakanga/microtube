import { Component, Show } from 'solid-js';

interface Props {
    name: string;
}

const Icon: Component<Props> = (props: Props) => (
    <Show when={props.name}>
        <span className="icon">
            <svg>
                <use href={`#icon-${props.name}`} />
            </svg>
        </span>
    </Show>
);

export default Icon;
