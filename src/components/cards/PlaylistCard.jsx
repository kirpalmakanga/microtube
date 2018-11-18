import React, { PureComponent } from 'react';
import Card from './Card';

class PlaylistCard extends PureComponent {
  render() {
    const { id, itemCount, queuePlaylist, ...props } = this.props;

    const buttons = [
      {
        title: 'Queue playlist',
        icon: 'playlist-add',
        onClick: queuePlaylist
      },
      {
        title: 'Queue and play playlist',
        icon: 'playlist-play',
        onClick: () => queuePlaylist({ playlistId: id, play: true })
      }
    ];

    return (
      <Card
        {...props}
        href={`/playlist/${id}`}
        badge={`${itemCount} video${itemCount !== 1 ? 's' : ''}`}
        buttons={buttons}
      />
    );
  }
}

export default PlaylistCard;
