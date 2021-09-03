import { FunctionComponent, memo } from 'react';

import { ThumbnailsData } from '../../../@types/alltypes';

import { getThumbnails } from '../../lib/helpers';

import CardContainer from './CardContainer';
import CardContent from './CardContent';
import CardContentInner from './CardContentInner';
import CardThumbnail from './CardThumbnail';
import Title from './CardTitle';

interface Props {
    title: string;
    thumbnails: ThumbnailsData;
    totalItemCount: number;
    goToChannel: () => void;
}

const SubscriptionCard: FunctionComponent<Props> = ({
    title,
    thumbnails,
    totalItemCount,
    goToChannel
}) => (
    <CardContainer>
        <CardContent onClick={goToChannel}>
            <CardThumbnail
                src={getThumbnails(thumbnails, 'medium')}
                altText={title}
                badgeText={`${totalItemCount} video${
                    totalItemCount > 1 ? 's' : ''
                }`}
            />

            <CardContentInner>
                <Title>{title}</Title>
            </CardContentInner>
        </CardContent>
    </CardContainer>
);

export default memo(SubscriptionCard);
