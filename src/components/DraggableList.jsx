import React, { PureComponent } from 'react';
import { throttle } from 'lodash';

class DraggableListItem extends PureComponent {
  render() {}
}

class DraggableList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { items: props.items };
  }

  getContainer = (el) => (this.container = el);

  getPlaceholder = () => {
    let placeholder = this.placeholder;

    /* TODO: passer la classe du placeholder en props eet modifier le style de la queue */

    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.classList.add('queue__item', 'queue__item--placeholder');
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

  dragStart = ({ target, currentTarget: dragged, dataTransfer }) => {
    dataTransfer.effectAllowed = 'move';

    dataTransfer.setData('text/html', dragged);

    document.body.style.cursor = 'grabbing';

    console.log('dragged', dragged);

    this.dragged = dragged;
    this.placeholder = this.getPlaceholder();
  };

  dragOver = throttle((e) => {
    //     e.preventDefault();
    const { target, relatedTarget, pageY } = e;

    const over = target ? target.parentNode : null;

    console.log('over', over);

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

  dragEnd = (e) => {
    const {
      state: { items },
      container,
      placeholder,
      nodePlacement,
      dragged,
      over
    } = this;

    const from = Number(dragged.dataset.index);
    let to = Number(over.dataset.index);

    e.preventDefault();

    if (from < to) {
      to--;
    }

    if (nodePlacement === 'after') {
      to++;
    }

    document.body.style.cursor = 'default';

    container.removeChild(placeholder);

    items.splice(to, 0, items.splice(from, 1)[0]);

    this.setState({ items });

    this.props.onItemMove(from, to);
    this.over = null;
  };

  render() {
    const {
      props: { containerClassName, itemClassName, renderItem },
      state: { items },
      getContainer,
      dragOver,
      dragStart,
      dragEnd
    } = this;

    return (
      <div className='draggable-list' onDragOver={dragOver} ref={getContainer}>
        {items.map((data, index) => (
          <div
            key={index}
            className='draggable-list__item'
            data-index={index}
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            draggable
          >
            {renderItem({ data })}
          </div>
        ))}
      </div>
    );
  }
}

export default DraggableList;
