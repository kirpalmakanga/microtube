// jshint esversion: 6, asi: true
// eslint-env es6

require('array.prototype.move')

import parseDuration from '../../lib/parseDuration'

const { connect } = ReactRedux

const placeholder = document.createElement('div')
placeholder.className = 'queue__item queue__item--placeholder'

const Queue = ({ player, dispatch }) => {
  function dragStart({ currentTarget, dataTransfer }) {
    dispatch({
      type: 'QUEUE_DRAG_ON',
      element: currentTarget
    })

    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData('text/html', currentTarget)
  }

  function dragEnd(e) {
    const oldIndex = Number(player.dragged.dataset.id)
    const newIndex = Number(player.over.dataset.id)
    let newQueue = player.queue

    player.dragged.classList.remove('queue__item--hidden')
    player.dragged.parentNode.removeChild(placeholder)

    newQueue.move(oldIndex, newIndex)

    dispatch({ type: 'QUEUE_DRAG_OFF' })

    dispatch({
      type: 'QUEUE_DRAG_SET',
      newQueue
    })
  }

  function dragOver (e) {
    const relY = e.clientY - e.target.offsetTop
    const height = e.target.offsetHeight / 2
    const parent = e.target.parentNode

    e.preventDefault()

    player.dragged.classList.add('queue__item--hidden')

    if(e.target.className === 'queue__item--placeholder' || !e.target.getAttribute('draggable')) {
      return
    }

    dispatch({
      type: 'QUEUE_DRAG_OVER',
      element: e.target
    })

    if(relY > height) {
      player.nodePlacement = 'after'
      parent.insertBefore(placeholder, e.target.nextElementSibling)
    }
    else if(relY < height) {
      player.nodePlacement = 'before'
      parent.insertBefore(placeholder, e.target)
    }
  }

  return (
    <div
      className={['queue mdl-shadow--2dp', player.showQueue ? 'queue--show': ''].join(' ')}
      onDragOver={dragOver}
    >
      {player.queue.map((item, i) => {
        const isCurrentVideo = (player.video.videoId === item.videoId)
        return (
          <div
            key={i}
            className={['queue__item', isCurrentVideo ? 'queue__item--active' : ''].join(' ')}
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            data-id={i}
            draggable
          >
            <span className='queue__item-title'>{item.title}</span>

            <span>{parseDuration(item.duration)}</span>

            {!isCurrentVideo ? (
              <button
                className='queue__item-button'
                onClick={() => {
                  dispatch({ type: 'CLEAR_WATCHERS' })

                  dispatch({
                    type: 'PLAY',
                    data: item,
                    skip: true
                  })
                }}
              >
                <svg><use xlinkHref='#icon-play'></use></svg>
              </button>
            ) : null}

            <button
              className='queue__item-button'
              onClick={() => dispatch({
                type: 'QUEUE_REMOVE',
                index: i
              })}
            >
              <svg><use xlinkHref='#icon-close'></use></svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    player: state.player
  }
}

export default connect(mapStateToProps)(Queue)
