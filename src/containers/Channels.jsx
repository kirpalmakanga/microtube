import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    getSubscriptions,
    subscribeToChannel,
    unsubscribeFromChannel
} from '../actions/youtube';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import ChannelCard from '../components/cards/ChannelCard';

const Subscriptions = ({
    items,
    totalResults,
    getSubscriptions,
    subscribeToChannel,
    unsubscribeFromChannel
}) => {
    const navigate = useNavigate();

    return totalResults === 0 ? (
        <Placeholder
            icon="empty"
            text="You haven't subscribed to any channel yet."
        />
    ) : (
        <List
            className="channels"
            items={items}
            itemKey={(index, data) => data[index].id}
            loadMoreItems={getSubscriptions}
            renderItem={({ data }) => {
                const { id, title, subscriptionId } = data;

                return (
                    <ChannelCard
                        {...data}
                        goToChannel={() => navigate(`/channel/${id}`)}
                        subscribe={() => subscribeToChannel(id)}
                        unsubscribe={() =>
                            unsubscribeFromChannel(subscriptionId, title)
                        }
                    />
                );
            }}
        />
    );
};

const mapStateToProps = ({ subscriptions: { items, totalResults } }) => ({
    items,
    totalResults
});

const mapDispatchToProps = {
    getSubscriptions,
    subscribeToChannel,
    unsubscribeFromChannel
};

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);
