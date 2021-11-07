import {
    closestLayoutCenter,
    createSortable,
    DragDropContext,
    DragDropSensors,
    SortableContext
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
    let siblings = [];

    if (e.parentNode) {
        let sibling = e.parentNode.firstChild;

        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== e) siblings.push(sibling);

            sibling = sibling.nextSibling;
        }
    }
    return siblings as HTMLElement[];
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

    const onMouseUp: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
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
    const [items, setItems] = createSignal(getItemIds(props.items));
    const ids = () => items();

    const onDragStart = ({ draggable: { node } }: { draggable: any }) => {
        getSiblings(node).forEach(
            (n) => (n.style.transition = 'transform 0.3s ease-out')
        );
    };

    const onDragEnd = ({
        draggable,
        droppable
    }: {
        draggable: any;
        droppable: any;
    }) => {
        if (!draggable || !droppable) {
            return;
        }

        getSiblings(draggable.node).forEach((n) => (n.style.transition = ''));

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
            onDragStart={onDragStart}
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
