import { Component } from 'solid-js';
import { getThumbnails } from '../../lib/helpers';
import Button from '../Button';
import Img from '../Img';

interface Props {
    title: string;
    thumbnails: ThumbnailsData;
    itemCount: number;
    onClick: () => void;
    onClickMenu: () => void;
}

const PlaylistCard: Component<Props> = (props) => (
    <div class="card" onContextMenu={props.onClickMenu}>
        <div class="card__content" onClick={props.onClick}>
            <div class="card__thumbnail">
                <Img
                    src={getThumbnails(props.thumbnails, 'medium')}
                    alt={props.title}
                    background
                />

                <span class="card__thumbnail-badge">
                    {`${props.itemCount} video${
                        props.itemCount !== 1 ? 's' : ''
                    }`}
                </span>
            </div>

            <div class="card__text">
                <h2 class="card__title">{props.title}</h2>
            </div>
        </div>
        <div class="card__buttons">
            <Button
                class="card__button icon-button"
                icon="more"
                onClick={props.onClickMenu}
            />
        </div>
    </div>
);

export default PlaylistCard;
