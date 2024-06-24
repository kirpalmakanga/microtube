import { Component, Show } from 'solid-js';
import { getThumbnails } from '../lib/helpers';
import Button from './Button';
import Img from './Img';
import ListItemThumbnail from './ListItemThumbnail';
import ListItemMeta from './ListItemMeta';

interface Props {
    index?: number;
    title: string;
    subtitle: string;
    subSubtitle: string;
    badge: string;
    thumbnails: ThumbnailsData;
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
                <div class="flex items-center justify-center text-sm text-light-50 bg-primary-900 font-montserrat p-4">
                    {(props.index || 0) + 1}
                </div>
            </Show>

            <div
                class="flex flex-grow overflow-hidden p-4 gap-4 cursor-pointer"
                onClick={props.onClick}
            >
                <ListItemThumbnail
                    img={getThumbnails(props.thumbnails, 'medium')}
                    alt={props.title}
                    badge={props.badge}
                />

                <ListItemMeta
                    title={props.title}
                    subtitle={props.subtitle}
                    subSubtitle={props.subSubtitle}
                />
            </div>

            <Show when={props.onClickMenu}>
                <div class="flex flex-col">
                    <Button
                        class="flex flex-grow items-center justify-center bg-primary-900 hover:bg-primary-800 transition-colors text-light-50 p-2"
                        icon="more"
                        iconClass="w-5 h-5"
                        onClick={props.onClickMenu}
                    />
                </div>
            </Show>
        </div>
    );
};

export default ListItem;
