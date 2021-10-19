import { Component } from 'solid-js';
import { Link } from 'solid-app-router';

import { VideoData } from '../../../@types/alltypes';

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
import CardTitle from './CardTitle';
import Subtitle from './CardSubtitle';

interface Props extends VideoData {
    onClick: () => void;
    onClickMenu: () => void;
}

const VideoCard: Component<Props> = ({
    title,
    thumbnails,
    publishedAt,
    privacyStatus,
    duration,
    channelId,
    channelTitle,
    onClick,
    onClickMenu
}) => (
    <CardContainer onContextMenu={onClickMenu}>
        <CardContent onClick={onClick}>
            <CardThumbnail
                src={getThumbnails(thumbnails, 'medium')}
                altText={title}
                badgeText={duration ? formatTime(duration) : null}
            />

            <CardContentInner>
                <CardTitle>{title}</CardTitle>

                {privacyStatus !== 'deleted' ? (
                    <Subtitle className="author">
                        <Link
                            href={`/channel/${channelId}`}
                            onClick={stopPropagation()}
                        >
                            {channelTitle}
                        </Link>
                    </Subtitle>
                ) : null}

                {publishedAt ? (
                    <Subtitle className="date">
                        {formatDate(publishedAt, 'MMMM do yyyy')}
                    </Subtitle>
                ) : null}
            </CardContentInner>
        </CardContent>

        <CardButtons>
            <Button
                aria-label="Open video menu"
                icon="more"
                onClick={onClickMenu}
            />
        </CardButtons>
    </CardContainer>
);

export default VideoCard;
