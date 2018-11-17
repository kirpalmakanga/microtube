import React, { Component } from 'react';
import { connect } from 'react-redux';

import { throttle } from 'lodash';
import QueueHeader from './QueueHeader';
import QueueItem from './QueueItem';

import DraggableList from '../DraggableList';

class Queue extends Component {
  moveQueueItem = (fromIndex, toIndex) => {
    const {
      props: { queue, setQueue }
    } = this;

    queue.splice(toIndex, 0, queue.splice(fromIndex, 1)[0]);

    setQueue(queue);
  };

  render() {
    const {
      props: {
        queue,
        showQueue,
        isPlaying,
        isBuffering,
        togglePlay,
        makeSetActiveItem,
        makeRemoveItem
      },
      moveQueueItem
    } = this;

    return (
      <div
        className={['queue shadow--2dp', showQueue ? 'queue--show' : ''].join(
          ' '
        )}
      >
        <QueueHeader />
        {/* <div
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
        </div> */}

        {queue.length ? (
          <DraggableList
            items={queue}
            onItemMove={moveQueueItem}
            renderItem={({ data: { title, duration, active } }, index) => (
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
                onClick={active ? togglePlay : makeSetActiveItem(index)}
                onClickRemove={makeRemoveItem(index)}
              />
            )}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({ player: { queue, showQueue } }) => ({
  queue,
  showQueue
});

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
