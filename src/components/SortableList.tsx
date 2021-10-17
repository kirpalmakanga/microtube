import { For, Show, Component, createSignal } from 'solid-js';
import {
    DragDropContext,
    SortableContext,
    DragDropSensors,
    DragOverlay,
    createSortable,
    closestLayoutCenter
} from '@thisbeyond/solid-dnd';
import { useOnScreen } from '../lib/hooks';
import { Transition } from 'solid-transition-group';
import { HTMLElementEvent } from '../../@types/alltypes';
import { preventDefault } from '../lib/helpers';

interface ListProps {
    items: any[];
    children: (...args: any[]) => Element;
    getItemId: (props: any) => number | string;
    onReorderItems: (updatedItems: any[]) => void;
}
interface ListItemProps {
    id: number | string;
    children: unknown;
}

const htmlToElement = (html: string) => {
    const template = document.createElement('template');

    template.innerHTML = html.trim();

    return template.content.firstChild as HTMLElement;
};

const reorder = (list: unknown[], fromIndex: number, toIndex: number) => {
    const result = [...list];

    result.splice(toIndex, 0, ...result.splice(fromIndex, 1));

    return result;
};

const SortableItem: Component<ListItemProps> = (props) => {
    const sortable = createSortable({ id: props.id });
    const [ref, isVisible]: [(el: HTMLElement) => void, () => boolean] =
        useOnScreen();

    const onMouseUp = (e: HTMLElementEvent<HTMLDivElement>) => {
        // @ts-ignore
        sortable.isActiveDraggable && e.preventDefault();
    };

    return (
        <div
            // @ts-ignore
            use:sortable
            ref={ref}
            className="sortable"
            classList={{
                // @ts-ignore
                'is--dragged': sortable.isActiveDraggable,
                'is--hidden': !isVisible()
            }}
            onMouseUp={onMouseUp}
        >
            <Show when={isVisible()}>{props.children}</Show>
        </div>
    );
};

const DraggableList: Component<ListProps> = (props) => {
    const getItemIds = (items: unknown[]) => items.map(props.getItemId);
    const [items, setItems] = createSignal(getItemIds(props.items));
    const ids = () => items();

    const onDragEnd = ({
        draggable,
        droppable
    }: {
        draggable: any;
        droppable: any;
    }) => {
        if (!droppable || !droppable) {
            return;
        }

        const currentItems = ids();
        const fromIndex = currentItems.indexOf(draggable.id);
        const toIndex = currentItems.indexOf(droppable.id);

        if (fromIndex !== toIndex) {
            const updatedItems = reorder(props.items, fromIndex, toIndex);

            setItems(getItemIds(updatedItems));

            props.onReorderItems(updatedItems);
        }
    };

    return (
        <DragDropContext
            onDragEnd={onDragEnd}
            collisionDetectionAlgorith={closestLayoutCenter}
        >
            <DragDropSensors />

            <SortableContext ids={ids()}>
                <For each={props.items}>
                    {(item) => (
                        <SortableItem id={props.getItemId(item)}>
                            {props.children(item)}
                        </SortableItem>
                    )}
                </For>
            </SortableContext>
        </DragDropContext>
    );
};

export default DraggableList;
