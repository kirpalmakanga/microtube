import React, { PureComponent } from 'react';
import Card from './Card';

class SubscriptionCard extends PureComponent {
  render() {
    const { channelId, title, thumbnails, itemCount } = this.props;
    return (
      <Card
        href={`/channel/${channelId}`}
        title={title}
        thumbnails={thumbnails}
        badge={`${itemCount} video${itemCount !== 1 ? 's' : ''}`}
      />
    );
  }
}

export default SubscriptionCard;
