import { FunctionComponent, memo } from 'react';
import { Link } from 'react-router-dom';

import { ThumbnailsData, VideoData } from '../../../@types/alltypes';

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

interface Props extends VideoData {
    onClick: () => void;
    onClickMenu: () => void;
}

const VideoCard: FunctionComponent<Props> = ({
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
                        {formatDate(publishedAt, 'MMMM do yyyy')}
                    </Subtitle>
                ) : null}
            </CardContentInner>
        </CardContent>

        <CardButtons>
            <Button title="Open video menu" icon="more" onClick={onClickMenu} />
        </CardButtons>
    </CardContainer>
);

export default memo(VideoCard);
