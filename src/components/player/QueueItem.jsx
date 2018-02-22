import { h } from 'preact'

import { parseDuration } from 'lib/helpers'

const QueueItem = ({
    title,
    duration,
    index,
    isActive,
    isPlaying,
    isBuffering,
    onClickRemove,
    ...props
}) => (
    <div
        className={['queue__item', isActive ? 'queue__item--active' : ''].join(
            ' '
        )}
        data-index={index}
        data-title={title}
        // data-duration={}
        {...props}
    >
        <div className="queue__item-title">{title}</div>
        <div className="queue__item-duration">{parseDuration(duration)}</div>
        <div className="queue__item-button icon-button">
            <span
                className={[
                    'icon',
                    isActive && isBuffering ? 'rotating' : ''
                ].join(' ')}
            >
                {isActive && isBuffering ? (
                    <svg>
                        <use xlinkHref="#icon-loading" />
                    </svg>
                ) : isActive && isPlaying ? (
                    <svg>
                        <use xlinkHref="#icon-pause" />
                    </svg>
                ) : (
                    <svg>
                        <use xlinkHref="#icon-play" />
                    </svg>
                )}
            </span>
        </div>

        <button
            className="queue__item-button icon-button"
            onClick={onClickRemove}
        >
            <span className="icon">
                <svg>
                    <use xlinkHref="#icon-close" />
                </svg>
            </span>
        </button>
    </div>
)

export default QueueItem
