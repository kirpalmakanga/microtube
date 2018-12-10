import React, { PureComponent } from 'react';

import { formatDate, formatTime } from '../../lib/helpers';

import Card from './Card';

class VideoCard extends PureComponent {
    render() {
        const {
            publishedAt,
            duration,
            channelTitle,
            queueItem,
            removeItem,
            editPlaylistItem,
            ...props
        } = this.props;

        const subTitles = [
            { className: 'channel', text: channelTitle },
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
                          icon: 'playlist-add'
                      }
                  ]
                : []),
            {
                title: `Queue video ${props.title}`,
                onClick: queueItem,
                icon: 'queue'
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
