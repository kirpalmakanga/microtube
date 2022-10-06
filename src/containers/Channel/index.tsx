import { createSignal, For, JSXElement, onCleanup, onMount } from 'solid-js';
import { NavLink, Outlet, useParams } from '@solidjs/router';
import Button from '../../components/Button';
import Img from '../../components/Img';
import { getThumbnails } from '../../lib/helpers';
import { useChannel } from '../../store/channel';

interface TabsProps {
    children: JSXElement[];
}

const Tabs = (props: TabsProps) => (
    <ul class="tabs">
        <For each={props.children}>
            {(child) => <li class="tab">{child}</li>}
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
        <div class="channel">
            <div class="channel__header">
                <div class="channel__header-inner">
                    <div class="channel__thumbnail">
                        <Img
                            src={getThumbnails(channel.thumbnails, 'medium')}
                            alt="Channel thumbnail"
                        />
                    </div>

                    <div class="channel__details">
                        <div class="channel__details-title">
                            {channel.channelTitle}
                        </div>

                        <Button
                            class="button"
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

                <Tabs>
                    <NavLink href="videos" replace>
                        Videos
                    </NavLink>
                    <NavLink href="playlists" replace>
                        Playlists
                    </NavLink>
                    <NavLink href="about" replace>
                        About
                    </NavLink>
                </Tabs>
            </div>

            <div class="channel__content">
                <Outlet />
            </div>
        </div>
    );
};

export default Channel;
