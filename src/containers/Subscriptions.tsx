import { Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import ListItem from '../components/ListItem';
import List from '../components/List';
import Placeholder from '../components/Placeholder';
import { useSubscriptions } from '../store/subscriptions';

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
                class="channels"
                items={subscriptions.items}
                loadItems={getData}
            >
                {({ data }) => {
                    const { id } = data;

                    return (
                        <ListItem
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
