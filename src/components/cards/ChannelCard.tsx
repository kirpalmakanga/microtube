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
    <div className="card">
        <div className="card__content" onClick={props.onClick}>
            <div className="card__thumbnail">
                <Img
                    src={getThumbnails(props.thumbnails, 'medium')}
                    alt={props.title}
                    background
                />

                <span className="card__thumbnail-badge">
                    {`${props.totalItemCount} video${
                        props.totalItemCount > 1 ? 's' : ''
                    }`}
                </span>
            </div>

            <div className="card__text">
                <h2 className="card__title">{props.title}</h2>
            </div>
        </div>
    </div>
);

export default SubscriptionCard;
