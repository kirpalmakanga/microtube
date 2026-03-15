import { Component, Show } from 'solid-js';
import Img from './ui/Img';

interface Props {
    img: string;
    alt: string;
    badge: string;
}

const ListItemThumbnail: Component<Props> = (props) => (
    <div class="relative flex bg-red flex-shrink-0">
        <Img
            class="rounded"
            imgClass="w-auto h-28 object-cover"
            src={props.img}
            alt={props.alt}
            background
        />

        <Show when={props.badge}>
            <span class="absolute bottom-2 right-2 bg-primary-700 bg-opacity-80 text-light-50 font-montserrat text-xs rounded px-2 py-1">
                {props.badge}
            </span>
        </Show>
    </div>
);

export default ListItemThumbnail;
