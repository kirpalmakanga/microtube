import { useRef, FunctionComponent, ReactNode } from 'react';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from 'react-beautiful-dnd';
import { combinedRef } from '../lib/helpers';
import { useOnScreen } from '../lib/hooks';

interface ListProps {
    className: string;
    items: any[];
    renderItem: (...args: any[]) => ReactNode;
    onReorderItems: (updatedItems: any[]) => void;
}
interface ListItemProps {
    index: number;
    children: (isVisible: boolean) => ReactNode;
}

const reorder = (
    list: unknown[],
    sourceIndex: number,
    destinationIndex: number
) => {
    const result = [...list];
    const [removed] = result.splice(sourceIndex, 1);

    result.splice(destinationIndex, 0, removed);

    return result;
};

const DraggableListItem: FunctionComponent<ListItemProps> = ({
    index,
    children
}: ListItemProps) => {
    const visibilityRef = useRef<HTMLElement | null>(null);
    const isVisible = useOnScreen(visibilityRef);

    return (
        <Draggable
            key={`draggable${index}`}
            draggableId={`draggable${index}`}
            index={index}
        >
            {({ innerRef, draggableProps, dragHandleProps }) => (
                <div
                    ref={combinedRef(visibilityRef, innerRef)}
                    {...draggableProps}
                    {...dragHandleProps}
                    style={{
                        transition: 'opacity 0.3s ease-out',
                        opacity: isVisible ? 1 : 0
                    }}
                >
                    {children(isVisible)}
                </div>
            )}
        </Draggable>
    );
};

const DraggableList: FunctionComponent<ListProps> = ({
    className,
    items = [],
    renderItem,
    onReorderItems
}) => {
    const containerRef = useRef<HTMLDivElement | null>();

    const getContainer =
        (innerRef: (el: HTMLDivElement) => void) => (el: HTMLDivElement) => {
            innerRef(el);

            containerRef.current = el;
        };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const {
            source: { index: sourceIndex },
            destination: { index: destinationIndex }
        } = result;

        if (sourceIndex === destinationIndex) {
            return;
        }

        const updatedItems = reorder(items, sourceIndex, destinationIndex);

        onReorderItems(updatedItems);
    };

    return items.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {({ innerRef, placeholder }) => (
                    <div className={className} ref={getContainer(innerRef)}>
                        {items.map((props, index) => (
                            <DraggableListItem index={index}>
                                {(isVisible) =>
                                    isVisible ? renderItem(props) : null
                                }
                            </DraggableListItem>
                        ))}
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    ) : null;
};

export default DraggableList;
