import { h } from 'preact'

const QueueItem = ({ title, index, isActive, isPlaying, isBuffering, onClickRemove, ...props }) => (
  <div
    className={['queue__item', isActive ? 'queue__item--active' : ''].join(' ')}
    data-index={index}
    data-title={title}
    {...props}
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
