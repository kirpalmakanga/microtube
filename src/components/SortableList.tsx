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
    sortableClass?: string;
    children: (data: any, index?: number) => JSXElement;
    getItemId: (props: any) => Id;
    onReorderItems: (updatedItems: any[]) => void;
}
interface ListItemProps {
    id: Id;
    hasTransition: boolean;
    class?: string;
}

const reorder = (list: unknown[], fromIndex: number, toIndex: number) => {
    const result = [...list];

    result.splice(toIndex, 0, ...result.splice(fromIndex, 1));

    return result;
};

const Sortable: ParentComponent<ListItemProps> = (props) => {
    let sortable = createSortable(props.id);

    // createEffect((previousId) => {
    //     if (props.id !== previousId) sortable = createSortable(props.id);

    //     return props.id;
    // }, props.id);

    return (
        <div
            ref={sortable.ref}
            class="relative flex overflow-hidden touch-none group"
            classList={{
                'opacity-50': sortable.isActiveDraggable,
                'transition-transform': props.hasTransition,
                [props.class || '']: !!props.class
            }}
            style={transformStyle(sortable.transform)}
        >
            <div
                class="absolute left-0 top-0 bottom-0 flex flex-shrink-0 items-center justify-center w-10 touch-none text-light-50 hover:text-opacity-50 transition-colors hidden group-hover:flex"
                classList={{
                    'cursor-grab': !sortable.isActiveDraggable,
                    'cursor-grabbing': sortable.isActiveDraggable
                }}
                {...sortable.dragActivators}
            >
                <Icon class="w-5 h-5" name="drag" />
            </div>

            {props.children}
        </div>
    );
};

const List = (props: ListProps) => {
    const context = useDragDropContext();

    if (!context) return;

    const [
        state,
        { addTransformer, removeTransformer, onDragStart, onDragEnd }
    ] = context;

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

        if (!draggable || !droppable) return;

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
                        <Sortable
                            id={props.getItemId(item)}
                            hasTransition={!!state.active.draggable}
                            class={props.sortableClass}
                        >
                            {props.children(item, index() + 1)}
                        </Sortable>
                    )}
                </For>
            </SortableProvider>

            <DragOverlay class="pointer-events-none z-1 left-0 right-0">
                <div class="relative flex overflow-hidden shadow cursor-grabbing bg-primary-700">
                    <div class="absolute left-0 top-0 bottom-0 flex flex-shrink-0 items-center justify-center w-10">
                        <Icon class="text-light-50 w-5 h-5" name="drag" />
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
