import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import VisibilitySensor from 'react-visibility-sensor';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

class FlatList extends Component {
    getContainer = (el) => {
        this.container = el;

        this.props.containerRef(el);
    };

    getItemStyle = (isVisible) => ({
        transition: 'opacity 0.3s ease-out',
        minHeight: '50px',

        ...(isVisible
            ? {}
            : {
                  opacity: 0,
                  visibility: 'hidden'
              })
    });

    render() {
        const {
            props: { className, items, renderItem },
            getContainer,
            getItemStyle
        } = this;

        return (
            <div className={className} ref={getContainer}>
                {items.length
                    ? items.map((props, index) => (
                          <VisibilitySensor
                              key={index}
                              resizeCheck={true}
                              partialVisibility={true}
                              scrollCheck={true}
                              scrollThrottle={100}
                              containment={this.container}
                          >
                              {({ isVisible }) =>
                                  typeof renderItem === 'function'
                                      ? renderItem(
                                            {
                                                props,
                                                style: getItemStyle(isVisible)
                                            },
                                            index
                                        )
                                      : null
                              }
                          </VisibilitySensor>
                      ))
                    : null}
            </div>
        );
    }
}

class DraggableList extends Component {
    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const {
            source: { index: startIndex },
            destination: { index: endIndex }
        } = result;

        const items = reorder(this.props.items, startIndex, endIndex);

        this.props.onReorderItems(items);
    };

    renderItem = ({ props, style }, index) => {
        const { renderItem } = this.props;

        return (
            <Draggable
                key={index}
                draggableId={`draggable${index}`}
                index={index}
            >
                {({ innerRef, draggableProps, dragHandleProps }) => (
                    <div
                        ref={innerRef}
                        {...draggableProps}
                        {...dragHandleProps}
                    >
                        <div style={style}>
                            {typeof renderItem === 'function'
                                ? renderItem(props, index)
                                : null}
                        </div>
                    </div>
                )}
            </Draggable>
        );
    };

    render() {
        const {
            props: { className, items = [] },
            onDragEnd,
            renderItem
        } = this;

        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {({ innerRef }) => (
                        <FlatList
                            className={className}
                            containerRef={innerRef}
                            items={items}
                            renderItem={renderItem}
                        />
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default DraggableList;
