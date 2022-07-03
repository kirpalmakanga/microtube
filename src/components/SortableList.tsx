import {
    createSortable,
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    DragOverlay,
    SortableProvider,
    closestCenter
} from '@thisbeyond/solid-dnd';
import {
    createEffect,
    createMemo,
    createSignal,
    For,
    JSXElement,
    ParentComponent,
    Show
} from 'solid-js';
import { isEqual } from '../lib/helpers';
import { useOnScreen } from '../lib/hooks';
interface ListProps {
    items: any[];
    children: (data: any, index?: number) => JSXElement;
    getItemId: (props: any) => number | string;
    onReorderItems: (updatedItems: any[]) => void;
}
interface ListItemProps {
    id: number | string;
    children: JSXElement;
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

const SortableItem: ParentComponent<ListItemProps> = (props) => {
    let sortable = createSortable(props.id);

    createEffect((previousId) => {
        if (props.id !== previousId) sortable = createSortable(props.id);

        return props.id;
    }, props.id);

    return (
        <div
            // @ts-ignore
            use:sortable
            class="sortable"
            classList={{
                'is--dragged has-transition': sortable.isActiveDraggable
            }}
        >
            {props.children}
        </div>
    );
};

const SortableList = (props: ListProps) => {
    const [activeItem, setActiveItem] = createSignal(null);
    const ids = createMemo(() => props.items.map(props.getItemId));

    const onDragStart: DragEventHandler = ({ draggable: { id, node } }) => {
        getSiblings(node).forEach((n) => n.classList.add('has--transition'));

        setActiveItem(props.items.find((item) => props.getItemId(item) === id));
    };

    const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
        getSiblings(draggable.node).forEach((n) =>
            n.classList.remove('has-transition')
        );

        setActiveItem(null);

        if (!draggable || !droppable) {
            return;
        }

        const currentItems = ids();
        const fromIndex = currentItems.indexOf(draggable.id);
        const toIndex = currentItems.indexOf(droppable.id);

        if (fromIndex !== toIndex) {
            const updatedItems = reorder(props.items, fromIndex, toIndex);

            requestAnimationFrame(() => props.onReorderItems(updatedItems));
        }
    };

    return (
        <DragDropProvider
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            collisionDetector={closestCenter}
        >
            <DragDropSensors />

            <SortableProvider ids={ids()}>
                <For each={props.items}>
                    {(item, index) => (
                        <SortableItem id={props.getItemId(item)}>
                            {props.children(item, index() + 1)}
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

export default SortableList;
