import { Component, Show } from 'solid-js';
import Img from '../Img';

interface Props {
    src: string;
    altText: string;
    badgeText: string | null;
}

const CardThumbnail: Component<Props> = (props) => (
    <div className="card__thumbnail">
        <Img src={props.src} alt={props.altText} background />

        <Show when={props.badgeText}>
            <span className="card__thumbnail-badge">{props.badgeText}</span>
        </Show>
    </div>
);

export default CardThumbnail;
