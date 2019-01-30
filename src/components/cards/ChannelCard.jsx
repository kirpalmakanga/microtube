import React, { PureComponent } from 'react';
import Card from './Card';

class SubscriptionCard extends PureComponent {
    render() {
        const {
            id,
            title,
            thumbnails,
            isUnsubscribed,
            totalItemCount,
            unsubscribe,
            subscribe
        } = this.props;

        const buttons = [
            isUnsubscribed
                ? {
                      title: 'Subscribe',
                      icon: 'check',
                      onClick: subscribe
                  }
                : {
                      title: 'Queue playlist',
                      icon: 'cancel',
                      onClick: unsubscribe
                  }
        ];

        return (
            <Card
                href={`/channel/${id}`}
                title={title}
                thumbnails={thumbnails}
                badge={`${totalItemCount} video${
                    totalItemCount > 1 ? 's' : ''
                }`}
                buttons={buttons}
            />
        );
    }
}

export default SubscriptionCard;
