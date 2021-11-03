import { Component } from 'solid-js';

import Button from '../Button';
import { getThumbnails } from '../../lib/helpers';
import { ThumbnailsData } from '../../../@types/alltypes';
import Img from '../Img';

interface Props {
    title: string;
    thumbnails: ThumbnailsData;
    itemCount: number;
    onClick: () => void;
    onClickMenu: () => void;
}

const PlaylistCard: Component<Props> = (props) => (
    <div className="card" onContextMenu={props.onClickMenu}>
        <div className="card__content" onClick={props.onClick}>
            <div className="card__thumbnail">
                <Img
                    src={getThumbnails(props.thumbnails, 'medium')}
                    alt={props.title}
                    background
                />

                <span className="card__thumbnail-badge">
                    {`${props.itemCount} video${
                        props.itemCount !== 1 ? 's' : ''
                    }`}
                </span>
            </div>

            <div className="card__text">
                <h2 className="card__title">{props.title}</h2>
            </div>
        </div>
        <div className="card__buttons">
            <Button
                className="card__button icon-button"
                icon="more"
                onClick={props.onClickMenu}
            />
        </div>
    </div>
);

export default PlaylistCard;
