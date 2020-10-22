import { useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import VisibilitySensor from 'react-visibility-sensor';

const reorder = (list, sourceIndex, destinationIndex) => {
    const result = [...list];
    const [removed] = result.splice(sourceIndex, 1);

    result.splice(destinationIndex, 0, removed);

    return result;
};

const DraggableList = ({
    className,
    items = [],
    renderItem,
    onReorderItems
}) => {
    const containerRef = useRef(null);

    const getContainer = (innerRef) => (el) => {
        innerRef(el);

        containerRef.current = el;
    };

    const onDragEnd = (result) => {
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

    const renderInnerItem = (props, index) => (
        <Draggable key={index} draggableId={`draggable${index}`} index={index}>
            {({ innerRef, draggableProps, dragHandleProps }) => (
                <VisibilitySensor
                    key={index}
                    resizeCheck={true}
                    partialVisibility={true}
                    scrollCheck={true}
                    scrollThrottle={100}
                    containment={containerRef.current}
                >
                    {({ isVisible }) => (
                        <div
                            ref={innerRef}
                            {...draggableProps}
                            {...dragHandleProps}
                        >
                            {isVisible ? renderItem(props, index) : null}
                        </div>
                    )}
                </VisibilitySensor>
            )}
        </Draggable>
    );

    return items.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {({ innerRef, placeholder }) => (
                    <div className={className} ref={getContainer(innerRef)}>
                        {items.map(renderInnerItem)}
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    ) : null;
};

export default DraggableList;
