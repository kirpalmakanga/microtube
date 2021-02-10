import { FunctionComponent } from 'react';
import Img from '../Img';

interface Props {
    src: string;
    altText: string;
    badgeText: string | null;
}

const CardThumbnail: FunctionComponent<Props> = ({
    src,
    altText,
    badgeText
}) => (
    <div className="card__thumbnail">
        {src ? <Img src={src} alt={altText} background /> : null}

        {badgeText ? (
            <span className="card__thumbnail-badge">{badgeText}</span>
        ) : null}
    </div>
);

export default CardThumbnail;
