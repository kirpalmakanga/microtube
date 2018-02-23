import { h } from 'preact'

import { parseDuration } from 'lib/helpers'

const QueueItem = ({
    title,
    duration,
    index,
    isActive,
    onClickRemove,
    icon,
    ...props
}) => (
    <div
        className={['queue__item', isActive ? 'queue__item--active' : ''].join(
            ' '
        )}
        {...props}
        data-index={index}
    >
        <div className="queue__item-title">{title}</div>
        <div className="queue__item-duration">{parseDuration(duration)}</div>
        <div className="queue__item-button icon-button">
            <span
                className={['icon', icon === 'loading' ? 'rotating' : ''].join(
                    ' '
                )}
            >
                <svg>
                    <use xlinkHref={`#icon-${icon}`} />
                </svg>
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
