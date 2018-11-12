import React, { PureComponent } from 'react';

import { formatDate, getThumbnails, parseDuration } from '../../lib/helpers';

import Img from '../Img';
import Icon from '../Icon';

class VideoCard extends PureComponent {
  render() {
    const {
      videoId,
      title,
      thumbnails,
      publishedAt,
      duration,
      channelTitle,
      onClick,
      pushToQueue
    } = this.props;

    return (
      <div className='card'>
        <div
          className='card__content'
          aria-label={`Play video ${title}`}
          onClick={onClick}
        >
          {thumbnails ? (
            <div className='card__thumb'>
              <Img
                src={getThumbnails(thumbnails, 'high')}
                alt={title}
                background
              />
              <span className='card__thumb-badge'>
                {parseDuration(duration)}
              </span>
            </div>
          ) : null}

          <div className='card__text'>
            <h2 className='card__text-title'>{title}</h2>
            <p className='card__text-subtitle channel'>{channelTitle}</p>
            <p className='card__text-subtitle date'>
              {formatDate(publishedAt, 'MMMM Do YYYY')}
            </p>
          </div>
        </div>

        <div className='card__buttons'>
          <button
            className='card__button icon-button'
            aria-label={`Queue video ${title}`}
            onClick={pushToQueue}
          >
            <Icon name='playlist-add' />
          </button>
        </div>
      </div>
    );
  }
}

export default VideoCard;
