import { Link } from 'solid-app-router';
import { Component, Show } from 'solid-js';
import { VideoData } from '../../../@types/alltypes';
import {
    formatDate,
    formatTime,
    getThumbnails,
    stopPropagation
} from '../../lib/helpers';
import Button from '../Button';
import Img from '../Img';

interface Props extends VideoData {
    index?: number;
    onClick: () => void;
    onClickMenu: () => void;
}

const VideoCard: Component<Props> = (props) => (
    <div class="card" onContextMenu={props.onClickMenu}>
        <Show when={typeof props.index === 'number'}>
            <div class="card__index">{props.index || 0 + 1}</div>
        </Show>
        <div class="card__content" onClick={props.onClick}>
            <div class="card__thumbnail">
                <Img
                    src={getThumbnails(props.thumbnails, 'medium')}
                    alt={props.title}
                    background
                />

                <Show when={props.duration}>
                    <span class="card__thumbnail-badge">
                        {formatTime(props.duration)}
                    </span>
                </Show>
            </div>

            <div class="card__text">
                <h2 class="card__title">{props.title}</h2>

                <Show when={props.privacyStatus !== 'deleted'}>
                    <h3 class="card__subtitle author">
                        <Link
                            href={`/channel/${props.channelId}`}
                            onClick={stopPropagation()}
                        >
                            {props.channelTitle}
                        </Link>
                    </h3>
                </Show>

                <Show when={props.publishedAt}>
                    <h3 class="card__subtitle date">
                        {formatDate(props.publishedAt, 'MMMM do yyyy')}
                    </h3>
                </Show>
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

export default VideoCard;
