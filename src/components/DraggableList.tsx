import { useRef, FunctionComponent, ReactNode } from 'react';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from 'react-beautiful-dnd';
import { combinedRef, omit } from '../lib/helpers';
import { useOnScreen } from '../lib/hooks';

interface ListProps {
    className: string;
    items: any[];
    renderItem: (...args: any[]) => ReactNode;
    getItemId: (props: any) => string;
    onReorderItems: (updatedItems: any[]) => void;
}
interface ListItemProps {
    draggableId: string;
    index: number;
    children: (isVisible: boolean) => ReactNode;
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

const DraggableListItem: FunctionComponent<ListItemProps> = ({
    index,
    draggableId,
    children
}: ListItemProps) => {
    const visibilityRef = useRef<HTMLElement | null>(null);

    return (
        <Draggable key={draggableId} draggableId={draggableId} index={index}>
            {({ innerRef, draggableProps, dragHandleProps }) => {
                const isVisible = useOnScreen(visibilityRef);

                return (
                    <div
                        ref={combinedRef(visibilityRef, innerRef)}
                        {...draggableProps}
                        {...dragHandleProps}
                        style={{
                            ...draggableProps.style,
                            ...(draggableProps.style?.transition
                                ? {}
                                : {
                                      transition: 'opacity 0.3s ease-out',
                                      opacity: isVisible ? 1 : 0
                                  })
                        }}
                    >
                        {children(isVisible)}
                    </div>
                );
            }}
        </Draggable>
    );
};

const DraggableList: FunctionComponent<ListProps> = ({
    className,
    items = [],
    renderItem,
    getItemId,
    onReorderItems
}) => {
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const {
            source: { index: sourceIndex },
            destination: { index: destinationIndex }
        } = result;

        if (sourceIndex !== destinationIndex) {
            const updatedItems = reorder(items, sourceIndex, destinationIndex);

            onReorderItems(updatedItems);
        }
    };

    return items.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {({ innerRef, droppableProps, placeholder }) => (
                    <div
                        className={className}
                        ref={innerRef}
                        {...droppableProps}
                    >
                        {items.map((props, index) => {
                            const id = getItemId(props);

                            return (
                                <DraggableListItem
                                    key={`draggable-${id}`}
                                    draggableId={`draggable-${id}`}
                                    index={index}
                                >
                                    {(isVisible) =>
                                        isVisible ? renderItem(props) : null
                                    }
                                </DraggableListItem>
                            );
                        })}
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    ) : null;
};

export default DraggableList;
