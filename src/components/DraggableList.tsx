import { For, Show, Component, ComponentProps } from 'solid-js';
import {
    DragDropContext,
    DragDropSensors,
    useDragDropContext,
    createDraggable,
    createDroppable,
    transformStyle
} from '@thisbeyond/solid-dnd';
import { combinedRef, omit } from '../lib/helpers';
import { useOnScreen } from '../lib/hooks';
import { Transition } from 'solid-transition-group';

interface DragComponentProps {
    id: unknown;
}

interface ListProps {
    className: string;
    items: any[];
    renderItem: (...args: any[]) => Element;
    getItemId: (props: any) => string;
    onReorderItems: (updatedItems: any[]) => void;
}
interface ListItemProps {
    id: string;
    children: unknown;
}

const reorder = (
    list: unknown[],
    sourceIndex: number,
    destinationIndex: number
) => {
    const result = [...list];

    result.splice(destinationIndex, 0, ...result.splice(sourceIndex, 1));

    return result;
};

const Draggable: Component<DragComponentProps> = ({ id }) => {
    const draggable = createDraggable({ id });

    return <div use:draggable>draggable</div>;
};

const Droppable: Component<DragComponentProps> = ({ id }: ComponentProps) => {
    const droppable = createDroppable({ id });

    return <div use:droppable>droppable</div>;
};

const DraggableListItem: Component<ListItemProps> = ({
    id,
    children
}: ListItemProps) => {
    let visibilityRef: HTMLElement;

    const isVisible = useOnScreen(visibilityRef);

    return (
        <Draggable id={id}>
            <div
                ref={visibilityRef}
                style={{
                    transition: 'opacity 0.3s ease-out',
                    opacity: isVisible() ? 1 : 0
                }}
            >
                <Transition name="fade" appear={true}>
                    <Show when={isVisible}>{children}</Show>
                </Transition>
            </div>
        </Draggable>
    );
};

const DraggableList: Component<ListProps> = ({
    className,
    items = [],
    renderItem,
    getItemId,
    onReorderItems
}) => {
    const [, { onDragEnd }] = useDragDropContext();

    onDragEnd(({ draggable, droppable }) => {
        if (!droppable) {
            return;
        }

        /* TODO: get source and destination indices */

        const {
            source: { index: sourceIndex },
            destination: { index: destinationIndex }
        } = result;

        if (sourceIndex !== destinationIndex) {
            const updatedItems = reorder(items, sourceIndex, destinationIndex);

            onReorderItems(updatedItems);
        }
    });

    return (
        <Show when={items.length}>
            <DragDropContext>
                <DragDropSensors>
                    <Droppable id="droppable">
                        <div className={className}>
                            <For each={items}>
                                {(props) => {
                                    const id = getItemId(props);

                                    return (
                                        <DraggableListItem
                                            id={`draggable-${id}`}
                                        >
                                            {renderItem(props)}
                                        </DraggableListItem>
                                    );
                                }}
                            </For>
                        </div>
                    </Droppable>
                </DragDropSensors>
            </DragDropContext>
        </Show>
    );
};

export default DraggableList;
