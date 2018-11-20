import React, { PureComponent } from 'react';
import { throttle } from 'lodash';

class DraggableList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { items: props.items };
    }

    componentDidUpdate = () => this.setState({ items: this.props.items });

    getContainer = (el) => (this.container = el);

    getPlaceholder = () => {
        let placeholder = this.placeholder;

        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.classList.add(
                'queue__item',
                'queue__item--placeholder'
            );
            placeholder.setAttribute('data-placeholder', '');
        }
        return placeholder;
    };

    insertPlaceholder = (pageY) => {
        const { container, placeholder, over } = this;
        const relY = pageY - over.offsetTop;
        const lastChildY =
            pageY - container.lastChild.offsetTop + over.offsetHeight / 2;

        if (relY <= lastChildY) {
            this.nodePlacement = 'after';
            container.insertBefore(placeholder, over.nextElementSibling);
        } else {
            this.nodePlacement = 'before';
            container.insertBefore(placeholder, over);
        }
    };

    dragStart = ({ currentTarget: dragged, dataTransfer }) => {
        dataTransfer.effectAllowed = 'move';

        dataTransfer.setData('text/html', dragged);

        document.body.style.cursor = 'grabbing';

        this.dragged = dragged;
        this.placeholder = this.getPlaceholder();
    };

    dragOver = throttle((e) => {
        const { target, pageY } = e;

        const over = target
            ? target.hasAttribute('data-placeholder')
                ? target
                : target.parentNode
            : null;

        if (
            !over ||
            over.classList.contains('queue__item--placeholder') ||
            !over.getAttribute('draggable')
        ) {
            return;
        }

        this.over = over;

        this.insertPlaceholder(pageY);
    }, 50);

    dragEnd = () => {
        const {
            props,
            container,
            placeholder,
            nodePlacement,
            dragged,
            over
        } = this;

        const items = [...props.items];

        const from = Number(dragged.dataset.index);
        let to = Number(over.dataset.index);

        if (from < to) {
            to--;
        }

        if (nodePlacement === 'after') {
            to++;
        }

        document.body.style.cursor = 'default';

        container.removeChild(placeholder);

        items.splice(to, 0, items.splice(from, 1)[0]);

        this.props.onItemMove(items);
        this.over = null;
        this.dragged = null;
    };

    render() {
        const {
            props: { className = '', items = [], renderItem = () => {} },
            getContainer,
            dragOver,
            dragStart,
            dragEnd
        } = this;

        return (
            <div
                className={['draggable-list', className].join(' ')}
                onDragOver={dragOver}
                ref={getContainer}
            >
                {items.map((data, index) => (
                    <div
                        key={index}
                        className="draggable-list__item"
                        data-index={index}
                        onDragStart={dragStart}
                        onDragEnd={dragEnd}
                        draggable
                    >
                        {renderItem(data, index)}
                    </div>
                ))}
            </div>
        );
    }
}

export default DraggableList;
