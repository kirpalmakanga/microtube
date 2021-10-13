import { Component, Show } from 'solid-js';

interface Props {
    name: string;
    className?: string;
}

const Icon: Component<Props> = (props: Props) => (
    <Show when={props.name}>
        <span className={['icon', props.className].filter(Boolean).join(' ')}>
            <svg>
                <use href={`#icon-${props.name}`} />
            </svg>
        </span>
    </Show>
);

export default Icon;
