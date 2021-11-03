import { Component, Show } from 'solid-js';
import { Link } from 'solid-app-router';

import { VideoData } from '../../../@types/alltypes';

import {
    formatDate,
    formatTime,
    getThumbnails,
    stopPropagation
} from '../../lib/helpers';

import Img from '../Img';
import Button from '../Button';

interface Props extends VideoData {
    onClick: () => void;
    onClickMenu: () => void;
}

const VideoCard: Component<Props> = (props) => (
    <div className="card" onContextMenu={props.onClickMenu}>
        <div className="card__content" onClick={props.onClick}>
            <div className="card__thumbnail">
                <Img
                    src={getThumbnails(props.thumbnails, 'medium')}
                    alt={props.title}
                    background
                />

                <Show when={props.duration}>
                    <span className="card__thumbnail-badge">
                        {formatTime(props.duration)}
                    </span>
                </Show>
            </div>

            <div className="card__text">
                <h2 className="card__title">{props.title}</h2>

                <Show when={props.privacyStatus !== 'deleted'}>
                    <h3 className="card__subtitle author">
                        <Link
                            href={`/channel/${props.channelId}`}
                            onClick={stopPropagation()}
                        >
                            {props.channelTitle}
                        </Link>
                    </h3>
                </Show>

                <Show when={props.publishedAt}>
                    <h3 className="card__subtitle date">
                        {formatDate(props.publishedAt, 'MMMM do yyyy')}
                    </h3>
                </Show>
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

export default VideoCard;
