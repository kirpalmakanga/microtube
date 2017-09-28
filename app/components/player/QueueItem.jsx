import { h } from 'preact'

const QueueItem = ({ id, isActive, isPlaying, isBuffering, title, onClick, onClickRemove, onDragEnd, onDragStart }) => (
  <div
    className={['queue__item', isActive ? 'queue__item--active' : ''].join(' ')}
    onClick={onClick}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    data-title={title}
    draggable
  >

    <div className='queue__item-button icon-button'>
      <span className={['icon', isActive && isBuffering ? 'rotating': ''].join(' ')}>
        {isActive && isBuffering ? (
          <svg><use xlinkHref='#icon-loading'></use></svg>
        )
        : isActive && isPlaying ? (
          <svg><use xlinkHref='#icon-pause'></use></svg>
        ) : (
          <svg><use xlinkHref='#icon-play'></use></svg>
        )}
      </span>
    </div>

    <button
      className='queue__item-button icon-button'
      onClick={onClickRemove}
    >
      <span className='icon'>
        <svg><use xlinkHref='#icon-close'></use></svg>
      </span>
    </button>
  </div>
)

export default QueueItem
