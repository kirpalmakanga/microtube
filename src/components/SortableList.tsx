import {
    createSortable,
    DragDropProvider,
    DragDropSensors,
    DragOverlay,
    SortableProvider,
    closestCenter,
    Transformer,
    useDragDropContext,
    Id,
    transformStyle
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
import Icon from './Icon';

interface ListProps {
    items: any[];
    children: (data: any, index?: number) => JSXElement;
    getItemId: (props: any) => Id;
    onReorderItems: (updatedItems: any[]) => void;
}
interface ListItemProps {
    id: Id;
    children: JSXElement;
}

const reorder = (list: unknown[], fromIndex: number, toIndex: number) => {
    const result = [...list];

    result.splice(toIndex, 0, ...result.splice(fromIndex, 1));

    return result;
};

const SortableItem: ParentComponent<ListItemProps> = (props) => {
    const [state] = useDragDropContext();
    let sortable = createSortable(props.id);

    createEffect((previousId) => {
        if (props.id !== previousId) sortable = createSortable(props.id);

        return props.id;
    }, props.id);

    return (
        <div
            // @ts-ignore
            ref={sortable.ref}
            class="sortable"
            classList={{
                'is--dragged': sortable.isActiveDraggable,
                'has--transition': !!state.active.draggable
            }}
            style={transformStyle(sortable.transform)}
        >
            <div
                class="sortable__drag-handle is-drag"
                {...sortable.dragActivators}
            >
                <Icon name="drag" />
            </div>

            {props.children}
        </div>
    );
};

const List = (props: ListProps) => {
    const [, { addTransformer, removeTransformer, onDragStart, onDragEnd }] =
        useDragDropContext();

    const [activeItem, setActiveItem] = createSignal(null);
    const ids = createMemo(() => props.items.map(props.getItemId));
    const transformer: Transformer = {
        id: 'constrain-x-axis',
        order: 100,
        callback: (transform) => ({ ...transform, x: 0 })
    };

    onDragStart(({ draggable }) => {
        addTransformer('draggables', draggable.id, transformer);

        setActiveItem(
            props.items.find((item) => props.getItemId(item) === draggable.id)
        );
    });

    onDragEnd(({ draggable, droppable }) => {
        setActiveItem(null);

        console.log({ draggable, droppable });

        if (!draggable || !droppable) {
            return;
        }

        const currentItems = ids();
        const fromIndex = currentItems.indexOf(draggable.id);
        const toIndex = currentItems.indexOf(droppable.id);

        removeTransformer('draggables', draggable.id, transformer.id);

        if (fromIndex !== toIndex) {
            const updatedItems = reorder(props.items, fromIndex, toIndex);

            requestAnimationFrame(() => props.onReorderItems(updatedItems));
        }
    });

    return (
        <>
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
                <div class="sortable shadow--2dp">
                    <div class="sortable__drag-handle">
                        <Icon name="drag" />
                    </div>

                    <Show when={activeItem()}>
                        {props.children(activeItem())}
                    </Show>
                </div>
            </DragOverlay>
        </>
    );
};

const SortableList = (props: ListProps) => {
    return (
        <DragDropProvider collisionDetector={closestCenter}>
            <DragDropSensors>
                <List {...props} />
            </DragDropSensors>
        </DragDropProvider>
    );
};

export default SortableList;
