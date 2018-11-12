import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getThumbnails } from '../../lib/helpers';

import Img from '../Img';
import Button from '../Button';

const PlaylistCard = ({
  id,
  title,
  thumbnails,
  itemCount,
  onClick,
  queuePlaylist
}) => (
  <div className='card'>
    <Link
      className='card__content'
      to={`/playlist/${id}`}
      onClick={onClick}
      aria-label={title}
    >
      <div className='card__thumb'>
        <Img src={getThumbnails(thumbnails, 'high')} alt={title} background />
        <span className='card__thumb-badge'>{`${itemCount} video${
          itemCount !== 1 ? 's' : ''
        }`}</span>
      </div>

      <div className='card__text'>
        <h2 className='card__text-title'>{title}</h2>
      </div>
    </Link>

    <div className='card__buttons'>
      <Button
        className='card__button icon-button'
        title='Queue playlist'
        icon='playlist-add'
        onClick={queuePlaylist}
      />

      <Button
        className='card__button icon-button'
        title='Queue and play playlist'
        icon='playlist-play'
        onClick={() =>
          queuePlaylist({
            playlistId: id,
            play: true
          })
        }
      />
    </div>
  </div>
);

export default PlaylistCard;
