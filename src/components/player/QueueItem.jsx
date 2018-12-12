import React, { Component } from 'react';

import Icon from '../Icon';

import { formatTime, stopPropagation } from '../../lib/helpers';

const QueueItem = ({
    title,
    duration,
    isActive,
    onClickRemove,
    editPlaylistItem,
    icon,
    ...props
}) => (
    <div
        className={[
            'queue__item shadow--2dp',
            isActive ? 'queue__item--active' : ''
        ].join(' ')}
        {...props}
    >
        <div className="queue__item-button icon-button">
            <Icon
                className={['icon', icon === 'loading' ? 'rotating' : ''].join(
                    ' '
                )}
                name={icon}
            />
        </div>

        <div className="queue__item-title">{title}</div>

        <div className="queue__item-duration">{formatTime(duration)}</div>

        <button
            className="queue__item-button icon-button"
            onClick={stopPropagation(editPlaylistItem)}
        >
            <Icon className="icon" name="playlist-add" />
        </button>

        <button
            className="queue__item-button icon-button"
            onClick={stopPropagation(onClickRemove)}
        >
            <Icon className="icon" name="close" />
        </button>
    </div>
);

export default QueueItem;
