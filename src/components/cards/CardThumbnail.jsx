import React from 'react';
import Img from '../Img';

const CardThumbnail = ({ src, altText, badgeText }) => (
    <div className="card__thumbnail">
        {src ? <Img src={src} alt={altText} background /> : null}

        {badgeText ? (
            <span className="card__thumbnail-badge">{badgeText}</span>
        ) : null}
    </div>
);

export default CardThumbnail;
