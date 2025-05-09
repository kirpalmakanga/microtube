import { Component, JSXElement, Show } from 'solid-js';

interface Props {
    title: string;
    subtitle?: string | JSXElement;
    subSubtitle?: string | JSXElement;
}

const ListItemMeta: Component<Props> = (props) => (
    <div class="flex flex-col gap-1 overflow-hidden">
        <h2 class="text-light-50 font-montserrat whitespace-nowrap overflow-ellipsis overflow-hidden">
            {props.title}
        </h2>

        <Show when={props.subtitle}>
            <h3 class="text-sm text-light-50 text-opacity-80 hover:text-opacity-50 transition-colors whitespace-nowrap overflow-ellipsis overflow-hidden">
                {props.subtitle}
            </h3>
        </Show>

        <Show when={props.subSubtitle}>
            <h4 class="text-xs text-light-50 text-opacity-60 whitespace-nowrap overflow-ellipsis overflow-hidden">
                {props.subSubtitle}
            </h4>
        </Show>
    </div>
);

export default ListItemMeta;
