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

const reorder = (list: unknown[], fromIndex: number, toIndex: number) => {
    const result = [...list];

    result.splice(toIndex, 0, ...result.splice(fromIndex, 1));

    return result;
};
/* TODO: fix weird reordering on drag end */
const SortableItem: Component<ListItemProps> = (props) => {
    const sortable = createSortable({ id: props.id });
    const [ref, isVisible] = useOnScreen();

    let isDragged = false;
    let movingTarget: HTMLElement;
    let cursorX = 0;
    let cursorY = 0;

    const dragMouseUp = preventDefault(() => {
        cursorX = 0;
        cursorY = 0;

        if (movingTarget) {
            movingTarget.onmouseup = null;
            movingTarget.onmousemove = null;
            movingTarget.remove();
        }
    });

    const setPosition = ({
        positionX,
        positionY
    }: {
        positionX: number;
        positionY: number;
    }) => {
        const { offsetTop, offsetLeft } = movingTarget;

        Object.assign(movingTarget.style, {
            left: `${offsetLeft - positionX}px`,
            top: `${offsetTop - positionY}px`
        });
    };

    const dragMouseMove = preventDefault(
        (e: HTMLElementEvent<HTMLDivElement>) => {
            const { clientX, clientY } = e;

            setPosition({
                positionX: cursorX - clientX,
                positionY: cursorY - clientY
            });

            cursorX = clientX;
            cursorY = clientY;
        }
    );

    const dragMouseDown = preventDefault(
        (e: HTMLElementEvent<HTMLDivElement>) => {
            const { currentTarget, clientX, clientY } = e;
            const container = currentTarget.parentNode as HTMLElement;

            cursorX = clientX;
            cursorY = clientY;

            movingTarget = currentTarget.cloneNode(true) as HTMLElement;

            Object.assign(movingTarget.style, {
                position: 'absolute',
                width: `${currentTarget.offsetWidth}px`,
                top: `${currentTarget.offsetTop}px`,
                left: `${currentTarget.offsetLeft}px`
            });

            container.append(movingTarget);

            document.onmouseup = dragMouseUp;
            document.onmousemove = dragMouseMove;
        }
    );

    return (
        <div
            use:sortable
            ref={ref}
            className="sortable"
            classList={{
                dragged: sortable.isActiveDraggable,
                hidden: !isVisible()
            }}
            onMouseDown={dragMouseDown}
            draggable={true}
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

            <DragOverlay>
                <div class="sortable"></div>
            </DragOverlay>
        </DragDropContext>
    );
};

export default DraggableList;
