import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { getThumbnails } from '../lib/helpers';

import Img from '../Img';
import Button from '../Button'

class PlaylistCard extends PureComponent {
    render() {
        const { href, onClick, id, title, thumbnails, itemCount } = this.props;

        return  (
            <div class='card'>
                <Link
                    class='card__content'
                    href={href}
                    onClick={onClick}
                    aria-label={title}
                >
                    
                    <div class='card__thumb'>
                        <Img src={getThumbnails(thumbnails, 'high')} alt={title} background />
                        <span class='card__thumb-badge'>{`${itemCount} video${
                            itemCount !== 1 ? 's' : ''
                            }`}</span>
                    </div>

                    <div class='card__text'>
                        <h2 class='card__text-title'>{title}</h2>
                    </div>
                </Link>

                <div class='card__buttons'>


                <Button className='card__button icon-button' title='Queue playlist' icon='playlist-add' onClick={() =>
                    queuePlaylist({
                        playlistId: id
                    })
                }
                />
                    <Button className='card__button icon-button'
                            title='Queue and play playlist'
                            icon='playlist-play'
                            onClick={() =>
                                queuePlaylist({
                                    playlistId: id,
                                    play: true
                                })
                            }/>
                </div>
            </div>
        );
}

export default PlaylistCard;
