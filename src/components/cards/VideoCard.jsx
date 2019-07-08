import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import {
    formatDate,
    formatTime,
    getThumbnails,
    stopPropagation
} from '../../lib/helpers';

import CardContainer from './CardContainer';
import CardContent from './CardContent';
import CardContentInner from './CardContentInner';
import CardThumbnail from './CardThumbnail';
import CardButtons from './CardButtons';
import Button from './CardButton';
import Title from './CardTitle';
import Subtitle from './CardSubtitle';

class VideoCard extends PureComponent {
    render() {
        const {
            title,
            thumbnails,
            publishedAt,
            privacyStatus,
            duration,
            channelId,
            channelTitle,
            playItem,
            queueItem,
            removeItem,
            editPlaylistItem
        } = this.props;

        return (
            <CardContainer>
                <CardContent onClick={playItem}>
                    <CardThumbnail
                        src={getThumbnails(thumbnails, 'medium')}
                        altText={title}
                        badgeText={duration ? formatTime(duration) : null}
                    />

                    <CardContentInner>
                        <Title>{title}</Title>

                        {privacyStatus !== 'deleted' ? (
                            <Subtitle className="author">
                                <Link
                                    to={`/channel/${channelId}`}
                                    onClick={stopPropagation()}
                                >
                                    {channelTitle}
                                </Link>
                            </Subtitle>
                        ) : null}

                        {publishedAt ? (
                            <Subtitle className="date">
                                {formatDate(publishedAt, 'MMMM Do YYYY')}
                            </Subtitle>
                        ) : null}
                    </CardContentInner>
                </CardContent>

                <CardButtons>
                    {removeItem ? (
                        <Button
                            title={`Remove video ${title}`}
                            onClick={removeItem}
                            icon="delete"
                        />
                    ) : null}

                    <Button
                        title="Manage playlists"
                        onClick={editPlaylistItem}
                        icon="playlist-add"
                    />

                    <Button
                        title={`Queue video ${title}`}
                        onClick={queueItem}
                        icon="queue"
                    />
                </CardButtons>
            </CardContainer>
        );
    }
}

export default VideoCard;
