import { Component } from 'solid-js';
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

const PlaylistCard: Component<Props> = (props) => (
    <CardContainer onContextMenu={props.onClickMenu}>
        <CardContent onClick={props.onClick}>
            <CardThumbnail
                src={getThumbnails(props.thumbnails, 'medium')}
                altText={props.title}
                badgeText={`${props.itemCount} video${
                    props.itemCount !== 1 ? 's' : ''
                }`}
            />

            <CardContentInner>
                <Title>{props.title}</Title>
            </CardContentInner>
        </CardContent>

        <CardButtons>
            <Button icon="more" onClick={props.onClickMenu} />
        </CardButtons>
    </CardContainer>
);

export default PlaylistCard;
