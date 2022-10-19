import {
    Component,
    createSignal,
    For,
    JSXElement,
    onCleanup,
    onMount
} from 'solid-js';
import { NavLink, Outlet, useParams } from '@solidjs/router';
import Button from '../../components/Button';
import Img from '../../components/Img';
import { getThumbnails } from '../../lib/helpers';
import { useChannel } from '../../store/channel';

interface TabsProps {
    items: { title: string; path: string }[];
}

const Tabs: Component<TabsProps> = (props) => (
    <ul class="flex">
        <For each={props.items}>
            {(data) => (
                <li class="flex-grow">
                    <NavLink
                        class="relative block bg-primary-900 text-light-50 hover:text-opacity-80 transition-colors text-center p-2"
                        activeClass="after:(content-DEFAULT absolute bottom-0 left-0 right-0 h-2px bg-light-50)"
                        href={data.path}
                        replace
                    >
                        {data.title}
                    </NavLink>
                </li>
            )}
        </For>
    </ul>
);

const Channel = () => {
    const { channelId } = useParams();

    const [channel, { getData, clearData, toggleSubscription }] =
        useChannel(channelId);

    const [isSubscribing, setSubscriptionStatus] = createSignal(false);

    const handleSubscription = async () => {
        setSubscriptionStatus(true);

        await toggleSubscription();

        setSubscriptionStatus(false);
    };

    onMount(() => getData());

    onCleanup(clearData);

    return (
        <div class="flex flex-col flex-grow">
            <div class="flex gap-4 p-4">
                <Img
                    class="w-24 h-24 flex-shrink-0"
                    src={getThumbnails(channel.thumbnails, 'medium')}
                />

                <div class="flex flex-col gap-4">
                    <h1 class="text-light-50">{channel.channelTitle}</h1>

                    <Button
                        class="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 transition-colors font-bold text-light-50 shadow"
                        isLoading={isSubscribing()}
                        disabled={isSubscribing()}
                        title={
                            isSubscribing()
                                ? ''
                                : channel.subscriptionId
                                ? 'Unsubscribe'
                                : 'Subscribe'
                        }
                        icon={isSubscribing() ? 'loading' : ''}
                        onClick={handleSubscription}
                    />
                </div>
            </div>

            <Tabs
                items={[
                    {
                        path: 'videos',
                        title: 'Videos'
                    },
                    {
                        path: 'playlists',
                        title: 'Playlists'
                    },
                    {
                        path: 'about',
                        title: 'About'
                    }
                ]}
            />

            <div class="flex flex-col flex-grow">
                <Outlet />
            </div>
        </div>
    );
};

export default Channel;
