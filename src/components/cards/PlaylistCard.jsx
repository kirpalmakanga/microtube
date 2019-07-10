import React, { PureComponent } from 'react';

import { getThumbnails } from '../../lib/helpers';

import CardContainer from './CardContainer';
import CardContent from './CardContent';
import CardContentInner from './CardContentInner';
import CardThumbnail from './CardThumbnail';
import CardButtons from './CardButtons';
import Button from './CardButton';
import Title from './CardTitle';

class PlaylistCard extends PureComponent {
    render() {
        const {
            title,
            thumbnails,
            itemCount,
            goToPlaylist,
            queuePlaylist,
            launchPlaylist,
            removePlaylist
        } = this.props;

        return (
            <CardContainer>
                <CardContent onClick={goToPlaylist}>
                    <CardThumbnail
                        src={getThumbnails(thumbnails, 'medium')}
                        altText={title}
                        badgeText={`${itemCount} video${
                            itemCount !== 1 ? 's' : ''
                        }`}
                    />

                    <CardContentInner>
                        <Title>{title}</Title>
                    </CardContentInner>
                </CardContent>

                <CardButtons>
                    {removePlaylist ? (
                        <Button
                            title={`Remove playlist ${title}`}
                            onClick={removePlaylist}
                            icon="delete"
                        />
                    ) : null}

                    <Button
                        title="Queue playlist"
                        onClick={queuePlaylist}
                        icon="queue"
                    />

                    <Button
                        title="Queue and play playlist"
                        onClick={launchPlaylist}
                        icon="playlist-play"
                    />
                </CardButtons>
            </CardContainer>
        );
    }
}

export default PlaylistCard;
