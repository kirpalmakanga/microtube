import React, { PureComponent } from 'react';

import { getThumbnails } from '../../lib/helpers';

import CardContainer from './CardContainer';
import CardContent from './CardContent';
import CardContentInner from './CardContentInner';
import CardThumbnail from './CardThumbnail';
import CardButtons from './CardButtons';
import Button from './CardButton';
import Title from './CardTitle';

class SubscriptionCard extends PureComponent {
    render() {
        const {
            title,
            thumbnails,
            isUnsubscribed,
            totalItemCount,
            goToChannel,
            unsubscribe,
            subscribe
        } = this.props;

        return (
            <CardContainer>
                <CardContent onClick={goToChannel}>
                    <CardThumbnail
                        src={getThumbnails(thumbnails, 'medium')}
                        altText={title}
                        badgeText={`${totalItemCount} video${
                            totalItemCount > 1 ? 's' : ''
                        }`}
                    />

                    <CardContentInner>
                        <Title>{title}</Title>
                    </CardContentInner>
                </CardContent>

                <CardButtons>
                    {isUnsubscribed ? (
                        <Button
                            title="Subscribe"
                            icon="check"
                            onClick={subscribe}
                        />
                    ) : (
                        <Button
                            title="Queue playlist"
                            icon="cancel"
                            onClick={unsubscribe}
                        />
                    )}
                </CardButtons>
            </CardContainer>
        );
    }
}

export default SubscriptionCard;
