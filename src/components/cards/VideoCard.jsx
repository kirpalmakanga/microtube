import React, { PureComponent } from 'react';

import { formatDate, parseDuration } from '../../lib/helpers';

import Card from './Card';

class VideoCard extends PureComponent {
  render() {
    const {
      publishedAt,
      duration,
      channelTitle,
      pushToQueue,
      ...props
    } = this.props;

    const subTitles = [channelTitle, formatDate(publishedAt, 'MMMM Do YYYY')];

    const buttons = [
      {
        title: `Queue video ${props.title}`,
        onClick: pushToQueue,
        icon: 'playlist-add'
      }
    ];

    return (
      <Card
        {...props}
        subTitles={subTitles}
        badge={parseDuration(duration)}
        buttons={buttons}
      />
    );
  }
}

export default VideoCard;
