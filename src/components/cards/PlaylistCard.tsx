import { FunctionComponent } from 'react';

import { memo } from 'react';

import { getThumbnails } from '../../lib/helpers';

import CardContainer from './CardContainer';
import CardContent from './CardContent';
import CardContentInner from './CardContentInner';
import CardThumbnail from './CardThumbnail';
import CardButtons from './CardButtons';
import Button from './CardButton';
import Title from './CardTitle';
import { ThumbnailsData } from '../../../@types/alltypes';

interface Props {
    title: string;
    thumbnails: ThumbnailsData;
    itemCount: number;
    onClick: () => void;
    onClickMenu: () => void;
}

const PlaylistCard: FunctionComponent<Props> = ({
    title,
    thumbnails,
    itemCount,
    onClick,
    onClickMenu
}) => (
    <CardContainer onContextMenu={onClickMenu}>
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
            <Button icon="more" onClick={onClickMenu} />
        </CardButtons>
    </CardContainer>
);

export default memo(PlaylistCard);
