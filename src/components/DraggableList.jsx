import React, { PureComponent } from 'react';

class DraggableListItem extends PureComponent {
  render() {}
}

class DraggableList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { items: props.items };
  }

  getPlaceholder = () => {
    let placeholder = this.placeholder;

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

    this.dragged = dragged;
    this.placeholder = this.getPlaceholder();
  };

  dragOver = () => {};

  dragEnd = () => {};

  dragOver = throttle((e) => {
    //     e.preventDefault();
    const { target: over, pageY } = e;

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
      state: { queue },
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

    queue.splice(to, 0, queue.splice(from, 1)[0]);

    this.props.setQueue(queue);
    this.over = null;
  };

  render() {
    const {
      props: { containerClassName, itemClassName, renderItem },
      state: { items }
    } = this;

    return (
      <div className='draggable-list'>
        {items.map((data) => (
          <div className='draggable-list__item'>{renderItem(data)}</div>
        ))}
      </div>
    );
  }
}

export default DraggableList;
