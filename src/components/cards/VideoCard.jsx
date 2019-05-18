import React, { PureComponent } from 'react';

import { formatDate, formatTime } from '../../lib/helpers';

import Card from './Card';

class VideoCard extends PureComponent {
    render() {
        const {
            publishedAt,
            duration,
            channelId,
            channelTitle,
            queueItem,
            removeItem,
            editPlaylistItem,
            ...props
        } = this.props;

        const subTitles = [
            {
                className: 'author',
                text: channelTitle,
                to: `/channel/${channelId}`
            },
            { className: 'date', text: formatDate(publishedAt, 'MMMM Do YYYY') }
        ];

        const buttons = [
            ...(typeof removeItem === 'function'
                ? [
                      {
                          title: 'Remove video',
                          onClick: removeItem,
                          icon: 'delete'
                      }
                  ]
                : []),
            ...(typeof editPlaylistItem === 'function'
                ? [
                      {
                          title: 'Manage playlists',
                          onClick: editPlaylistItem,
                          icon: 'queue'
                      }
                  ]
                : []),
            {
                title: `Queue video ${props.title}`,
                onClick: queueItem,
                icon: 'playlist-add'
            }
        ];

        return (
            <Card
                {...props}
                subTitles={subTitles}
                badge={formatTime(duration)}
                buttons={buttons}
            />
        );
    }
}

export default VideoCard;
