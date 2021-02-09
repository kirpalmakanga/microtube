import { useNavigate } from 'react-router-dom';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import ChannelCard from '../components/cards/ChannelCard';
import { useSubscriptions } from '../store/hooks/subscriptions';
import { ChannelData } from '../../@types/alltypes';

const Subscriptions = () => {
    const navigate = useNavigate();
    const [
        { items, totalResults },
        { getSubscriptions, subscribeToChannel, unsubscribeFromChannel }
    ] = useSubscriptions();

    return totalResults === 0 ? (
        <Placeholder
            icon="list"
            text="You haven't subscribed to any channel yet."
        />
    ) : (
        <List
            className="channels"
            items={items}
            itemKey={({ id }: ChannelData) => id}
            loadMoreItems={getSubscriptions}
            renderItem={(data) => {
                const { id, title, subscriptionId } = data;

                const handleSubscribeToChannel = () => subscribeToChannel(id);

                const handleUnsubscribeFromChannel = () =>
                    unsubscribeFromChannel(subscriptionId, title);

                return (
                    <ChannelCard
                        {...data}
                        goToChannel={() => navigate(`/channel/${id}`)}
                        subscribe={handleSubscribeToChannel}
                        unsubscribe={handleUnsubscribeFromChannel}
                    />
                );
            }}
        />
    );
};

export default Subscriptions;
