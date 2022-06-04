import {
    createSortable,
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    DragOverlay,
    SortableProvider
} from '@thisbeyond/solid-dnd';
import { Component, createSignal, For, JSX, JSXElement, Show } from 'solid-js';
import { useOnScreen } from '../lib/hooks';
interface ListProps {
    items: any[];
    children: (data: any) => JSXElement;
    getItemId: (props: any) => number | string;
    onReorderItems: (updatedItems: any[]) => void;
}
interface ListItemProps {
    id: number | string;
    children: unknown;
}

const getSiblings = (e: HTMLElement) => {
    const { parentNode } = e;

    if (parentNode) {
        return Array.from(parentNode.childNodes).filter(
            (element) => element?.nodeType === 1 && element !== e
        ) as HTMLElement[];
    } else return [];
};

const reorder = (list: unknown[], fromIndex: number, toIndex: number) => {
    const result = [...list];

    result.splice(toIndex, 0, ...result.splice(fromIndex, 1));

    return result;
};

const SortableItem: Component<ListItemProps> = (props) => {
    const sortable = createSortable(props.id);
    const [ref, isVisible]: [(el: HTMLElement) => void, () => boolean] =
        useOnScreen();

    const onMouseUp: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
        sortable.isActiveDraggable && e.preventDefault();
    };

    return (
        <div
            // @ts-ignore
            use:sortable
            ref={ref}
            class="sortable"
            classList={{
                'is--dragged': sortable.isActiveDraggable
            }}
            onMouseUp={onMouseUp}
        >
            <Show when={isVisible()}>{props.children}</Show>
        </div>
    );
};

const DraggableList = (props: ListProps) => {
    const getItemIds = (items: unknown[]) => items.map(props.getItemId);
    const [ids, setIds] = createSignal(getItemIds(props.items));
    const [activeItem, setActiveItem] = createSignal(null);

    const onDragStart: DragEventHandler = ({ draggable: { id, node } }) => {
        getSiblings(node).forEach(
            (n) => (n.style.transition = 'transform 0.3s ease-out')
        );

        setActiveItem(props.items.find((item) => item.id === id));
    };

    const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
        if (!draggable || !droppable) {
            return;
        }

        getSiblings(draggable.node).forEach((n) => (n.style.transition = ''));

        const currentItems = ids();
        const fromIndex = currentItems.indexOf(draggable.id);
        const toIndex = currentItems.indexOf(droppable.id);

        if (fromIndex !== toIndex) {
            const updatedItems = reorder(props.items, fromIndex, toIndex);

            setIds(getItemIds(updatedItems));

            props.onReorderItems(updatedItems);
        }

        setActiveItem(null);
    };

    return (
        <DragDropProvider onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <DragDropSensors />

            <SortableProvider ids={ids()}>
                <For each={props.items}>
                    {(item) => (
                        <SortableItem id={props.getItemId(item)}>
                            {props.children(item)}
                        </SortableItem>
                    )}
                </For>
            </SortableProvider>

            <DragOverlay class="sortable-overlay">
                <div class="sortable">
                    <Show when={activeItem()}>
                        {props.children(activeItem())}
                    </Show>
                </div>
            </DragOverlay>
        </DragDropProvider>
    );
};

export default DraggableList;
