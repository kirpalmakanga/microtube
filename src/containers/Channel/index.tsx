import { Component, For, onCleanup, onMount } from 'solid-js';
import { Outlet, NavLink, useParams } from 'solid-app-router';

import { getThumbnails } from '../../lib/helpers';

import Img from '../../components/Img';
import Button from '../../components/Button';
import { useChannel } from '../../store/hooks/channel';

interface TabsProps {
    children: Element[];
}

const Tabs: Component<TabsProps> = (props) => (
    <ul className="tabs">
        <For each={props.children}>
            {(content: Element) => <li className="tab">{content}</li>}
        </For>
    </ul>
);

const Channel = () => {
    const { channelId } = useParams();

    const [channel, { getData, clearData, toggleSubscription }] =
        useChannel(channelId);

    onMount(() => getData(channelId));

    onCleanup(clearData);

    return (
        <div className="channel">
            <div className="channel__header">
                <div className="channel__header-inner">
                    <div className="channel__thumbnail">
                        <Img
                            src={getThumbnails(channel.thumbnails, 'medium')}
                            alt="Channel thumbnail"
                        />
                    </div>

                    <div className="channel__details">
                        <div className="channel__details-title">
                            {channel.channelTitle}
                        </div>

                        <Button
                            title={
                                channel.subscriptionId
                                    ? 'Unsubscribe'
                                    : 'Subscribe'
                            }
                            onClick={toggleSubscription}
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

            <div className="channel__content">
                <Outlet />
            </div>
        </div>
    );
};

export default Channel;
