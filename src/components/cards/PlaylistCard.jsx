import { memo } from 'react';

import { getThumbnails, preventDefault } from '../../lib/helpers';

import CardContainer from './CardContainer';
import CardContent from './CardContent';
import CardContentInner from './CardContentInner';
import CardThumbnail from './CardThumbnail';
import CardButtons from './CardButtons';
import Button from './CardButton';
import Title from './CardTitle';

const PlaylistCard = ({
    title,
    thumbnails,
    itemCount,
    onClick,
    onClickMenu
}) => (
    <CardContainer onContextMenu={preventDefault(onClickMenu)}>
        <CardContent onClick={onClick}>
            <CardThumbnail
                src={getThumbnails(thumbnails, 'medium')}
                altText={title}
                badgeText={`${itemCount} video${itemCount !== 1 ? 's' : ''}`}
            />

            <CardContentInner>
                <Title>{title}</Title>
            </CardContentInner>
        </CardContent>

        <CardButtons>
            <Button
                title="Open playlist menu"
                icon="more"
                onClick={onClickMenu}
            />
        </CardButtons>
    </CardContainer>
);

export default memo(PlaylistCard);
