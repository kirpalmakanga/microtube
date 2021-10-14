import { Component } from 'solid-js';

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

const SubscriptionCard: Component<Props> = (props) => (
    <CardContainer>
        <CardContent onClick={props.goToChannel}>
            <CardThumbnail
                src={getThumbnails(props.thumbnails, 'medium')}
                altText={props.title}
                badgeText={`${props.totalItemCount} video${
                    props.totalItemCount > 1 ? 's' : ''
                }`}
            />

            <CardContentInner>
                <Title>{props.title}</Title>
            </CardContentInner>
        </CardContent>
    </CardContainer>
);

export default memo(SubscriptionCard);
