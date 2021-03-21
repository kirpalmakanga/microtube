import { FunctionComponent, memo } from 'react';

import { ThumbnailsData } from '../../../@types/alltypes';

import { getThumbnails } from '../../lib/helpers';

import CardContainer from './CardContainer';
import CardContent from './CardContent';
import CardContentInner from './CardContentInner';
import CardThumbnail from './CardThumbnail';
import CardButtons from './CardButtons';
import Button from './CardButton';
import Title from './CardTitle';

interface Props {
    title: string;
    thumbnails: ThumbnailsData;
    isUnsubscribed: boolean;
    totalItemCount: number;
    goToChannel: () => void;
    unsubscribe: () => void;
    subscribe: () => void;
}

const SubscriptionCard: FunctionComponent<Props> = ({
    title,
    thumbnails,
    isUnsubscribed,
    totalItemCount,
    goToChannel,
    unsubscribe,
    subscribe
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

        <CardButtons>
            {isUnsubscribed ? (
                <Button title="Subscribe" icon="check" onClick={subscribe} />
            ) : (
                <Button icon="error" onClick={unsubscribe} />
            )}
        </CardButtons>
    </CardContainer>
);

export default memo(SubscriptionCard);
