import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from './Channel/react-router-dom';

import {
    getSubscriptions,
    subscribeToChannel,
    unsubscribeFromChannel
} from '../actions/youtube';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import ChannelCard from '../components/cards/ChannelCard';

const Subscriptions = () => {
    const navigate = useNavigate();

    const { items, totalResults } = useSelector(
        ({ subscriptions: { items, totalResults } }) => ({
            items,
            totalResults
        })
    );

    const dispatch = useDispatch();

    const handleGetSubscriptions = () => dispatch(getSubscriptions());

    return totalResults === 0 ? (
        <Placeholder
            icon="list"
            text="You haven't subscribed to any channel yet."
        />
    ) : (
        <List
            className="channels"
            items={items}
            itemKey={(index, data) => data[index].id}
            loadMoreItems={handleGetSubscriptions}
            renderItem={({ data }) => {
                const { id, title, subscriptionId } = data;

                const handleSubscribeToChannel = () =>
                    dispatch(subscribeToChannel(id));

                const handleUnsubscribeFromChannel = () =>
                    dispatch(unsubscribeFromChannel(subscriptionId, title));

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
