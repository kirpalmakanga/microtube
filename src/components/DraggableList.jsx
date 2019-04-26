import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import VisibilitySensor from 'react-visibility-sensor';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

class DraggableList extends Component {
    getContainer = (innerRef) => (el) => {
        this.container = el;

        innerRef(el);
    };

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const { items, onReorderItems } = this.props;

        const {
            source: { index: startIndex },
            destination: { index: endIndex }
        } = result;

        const updatedItems = reorder(items, startIndex, endIndex);

        onReorderItems(updatedItems);
    };

    renderItem = (props, index) => {
        const { renderItem } = this.props;

        return (
            <Draggable
                key={index}
                draggableId={`draggable${index}`}
                index={index}
            >
                {({ innerRef, draggableProps, dragHandleProps }) => (
                    <VisibilitySensor
                        key={index}
                        resizeCheck={true}
                        partialVisibility={true}
                        scrollCheck={true}
                        scrollThrottle={100}
                        containment={this.container}
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
    };

    render() {
        const {
            props: { className, items = [] },
            getContainer,
            onDragEnd,
            renderItem
        } = this;

        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {({ innerRef }) => (
                        <div className={className} ref={getContainer(innerRef)}>
                            {items.length ? items.map(renderItem) : null}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default DraggableList;
