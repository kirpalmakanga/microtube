import { Show } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import ChannelCard from '../components/cards/ChannelCard';
import { useSubscriptions } from '../store/hooks/subscriptions';

const Subscriptions = () => {
    const navigate = useNavigate();
    const [subscriptions, { getData }] = useSubscriptions();

    return (
        <Show
            when={
                subscriptions.totalResults === null ||
                subscriptions.totalResults > 0
            }
            fallback={
                <Placeholder
                    icon="list"
                    text="You haven't subscribed to any channel yet."
                />
            }
        >
            <List
                className="channels"
                items={subscriptions.items}
                loadItems={getData}
            >
                {({ data }) => {
                    const { id } = data;

                    return (
                        <ChannelCard
                            {...data}
                            onClick={() => navigate(`/channel/${id}`)}
                        />
                    );
                }}
            </List>
        </Show>
    );
};

export default Subscriptions;
