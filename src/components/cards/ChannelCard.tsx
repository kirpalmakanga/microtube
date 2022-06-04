import { Component } from 'solid-js';
import { ThumbnailsData } from '../../../@types/alltypes';
import { getThumbnails } from '../../lib/helpers';
import Img from '../Img';

interface Props {
    title: string;
    thumbnails: ThumbnailsData;
    totalItemCount: number;
    onClick: () => void;
}

const SubscriptionCard: Component<Props> = (props) => (
    <div class="card">
        <div class="card__content" onClick={props.onClick}>
            <div class="card__thumbnail">
                <Img
                    src={getThumbnails(props.thumbnails, 'medium')}
                    alt={props.title}
                    background
                />

                <span class="card__thumbnail-badge">
                    {`${props.totalItemCount} video${
                        props.totalItemCount > 1 ? 's' : ''
                    }`}
                </span>
            </div>

            <div class="card__text">
                <h2 class="card__title">{props.title}</h2>
            </div>
        </div>
    </div>
);

export default SubscriptionCard;
