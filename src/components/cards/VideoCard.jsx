import { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import {
    formatDate,
    formatTime,
    getThumbnails,
    stopPropagation,
    preventDefault
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
            onClick,
            onClickMenu
        } = this.props;

        return (
            <CardContainer onContextMenu={preventDefault(onClickMenu)}>
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
                    <Button
                        title="Open video menu"
                        icon="more"
                        onClick={onClickMenu}
                    />
                </CardButtons>
            </CardContainer>
        );
    }
}

export default VideoCard;
