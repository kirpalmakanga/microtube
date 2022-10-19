import { NavLink } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import { getThumbnails } from '../lib/helpers';
import Button from './Button';
import Img from './Img';

interface Props {
    index?: number;
    title: string;
    subtitle: string;
    subSubtitle: string;
    badge: string;
    thumbnails: ThumbnailsData;
    itemCount: number;
    onClick: () => void;
    onClickMenu: () => void;
}

const ListItem: Component<Props> = (props) => {
    return (
        <div
            class="flex w-full bg-primary-700 hover:bg-primary-600 transition-colors no-highlights"
            onContextMenu={props.onClickMenu}
        >
            <Show when={typeof props.index === 'number'}>
                <div class="flex items-center justify-center text-light-50 bg-primary-900 font-montserrat p-4">
                    {(props.index || 0) + 1}
                </div>
            </Show>

            <div
                class="flex flex-grow overflow-hidden p-4 cursor-pointer"
                onClick={props.onClick}
            >
                <div class="relative flex mr-4 ">
                    <Img
                        class="w-48"
                        imgClass="w-full h-full object-cover"
                        src={getThumbnails(props.thumbnails, 'medium')}
                        alt={props.title}
                        background
                    />

                    <Show when={props.badge}>
                        <span class="absolute bottom-2 right-2 bg-primary-700 bg-opacity-80 text-light-50 font-montserrat text-xs rounded px-2 py-1">
                            {props.badge}
                        </span>
                    </Show>
                </div>

                <div class="flex flex-col gap-1 overflow-hidden">
                    <h2 class="text-light-50  font-montserrat whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {props.title}
                    </h2>

                    <Show when={props.subtitle}>
                        <h3 class="text-sm text-light-50 text-opacity-80 hover:text-opacity-60 transition-colors author">
                            {props.subtitle}
                        </h3>
                    </Show>

                    <Show when={props.subSubtitle}>
                        <h4 class="text-xs text-light-50 text-opacity-60">
                            {props.subSubtitle}
                        </h4>
                    </Show>
                </div>
            </div>

            <Show when={props.onClickMenu}>
                <div class="flex flex-col">
                    <Button
                        class="flex flex-grow items-center justify-center bg-primary-900 hover:bg-primary-800 transition-colors text-light-50 p-2"
                        icon="more"
                        iconClass="w-6 h-6"
                        onClick={props.onClickMenu}
                    />
                </div>
            </Show>
        </div>
    );
};

export default ListItem;
