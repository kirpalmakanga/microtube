import React, { Component } from 'react';
import { connect } from 'react-redux';

import { throttle } from 'lodash';

import parseDuration from '../../lib/parseDuration';

import QueueHeader from './QueueHeader';
import QueueItem from './QueueItem';

class Queue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queue: props.player.queue
    };
  }

  over = null;

  componentDidUpdate = () => {
    this.updateQueue();
  };

  updateQueue = () => {
    const { queue: currentQueue } = this.state;
    const {
      player: { queue }
    } = this.props;

    currentQueue.length !== queue.length && this.setState({ queue });
  };

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
      props: {
        player: { showQueue },
        isPlaying,
        isBuffering,
        togglePlay,
        makeSetActiveItem,
        makeRemoveItem
      },
      state: { queue },
      dragEnd,
      dragStart,
      dragOver
    } = this;

    return (
      <div
        className={['queue shadow--2dp', showQueue ? 'queue--show' : ''].join(
          ' '
        )}
      >
        <QueueHeader />
        <div
          className='queue__items'
          onDragOver={dragOver}
          ref={(el) => (this.container = el)}
        >
          {queue.length
            ? queue.map(
                ({ title, duration, active }, index) => (
                  <QueueItem
                    key={index}
                    index={index}
                    title={title}
                    duration={duration}
                    isActive={active}
                    icon={
                      active && isBuffering
                        ? 'loading'
                        : active && isPlaying
                        ? 'pause'
                        : 'play'
                    }
                    onDragStart={dragStart}
                    onDragEnd={dragEnd}
                    onClick={active ? togglePlay : makeSetActiveItem(index)}
                    onClickRemove={makeRemoveItem(index)}
                    draggable
                  />
                ),
                this
              )
            : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ player }) => ({ player });

const mapDispatchToProps = (dispatch) => ({
  setQueue: (data) => dispatch({ type: 'QUEUE_SET', data }),

  makeSetActiveItem: (index) => () => {
    dispatch({
      type: 'QUEUE_SET_ACTIVE_ITEM',
      data: { index }
    });
  },

  makeRemoveItem: (index) => (e) => {
    e.stopPropagation();
    dispatch({ type: 'QUEUE_REMOVE', data: index });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Queue);
