import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { getThumbnails } from '../../lib/helpers';

import Img from '../Img';

const SubscriptionCard = ({ channelId, title, thumbnails, itemCount }) => {
    return (
        <div className="card">
            <Link
                className="card__content"
                to={`/channel/${channelId}`}
                aria-label={`Open channel ${title}`}
            >
                <div className="card__thumb">
                    <Img
                        src={getThumbnails(thumbnails, 'high')}
                        alt={title}
                        background
                    />
                    <span className="card__thumb-badge">{`${itemCount} video${
                        itemCount !== 1 ? 's' : ''
                    }`}</span>
                </div>

                <div className="card__text">
                    <h2 className="card__text-title">{title}</h2>
                </div>
            </Link>
        </div>
    );
};

export default SubscriptionCard;
