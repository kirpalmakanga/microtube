import { useEffect, FunctionComponent, ReactNode } from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';

import { getThumbnails } from '../../lib/helpers';

import Img from '../../components/Img';
import { useChannel } from '../../store/hooks/channel';
import Button from '../../components/Button';

interface TabsProps {
    children: ReactNode[];
}

const Tabs: FunctionComponent<TabsProps> = ({ children }) => (
    <ul className="tabs">
        {children.map((content: ReactNode, index: number) => (
            <li key={index} className="tab">
                {content}
            </li>
        ))}
    </ul>
);

const Channel = () => {
    const { channelId } = useParams();
    const [
        { channelTitle, thumbnails, subscriptionId },
        { getChannel, clearChannelData, toggleSubscription }
    ] = useChannel(channelId);

    useEffect(() => {
        getChannel(channelId);

        return clearChannelData;
    }, [channelId]);

    return (
        <div className="channel">
            <div className="channel__header">
                <div className="channel__header-inner">
                    <div className="channel__thumbnail">
                        <Img
                            src={getThumbnails(thumbnails, 'medium')}
                            alt="Channel thumbnail"
                        />
                    </div>

                    <div className="channel__details">
                        <div className="channel__details-title">
                            {channelTitle}
                        </div>

                        <Button
                            title={
                                subscriptionId ? 'Unsubscribe' : 'Subscribed'
                            }
                            onClick={toggleSubscription}
                        />
                    </div>
                </div>

                <Tabs>
                    <NavLink to="videos" replace>
                        Videos
                    </NavLink>

                    <NavLink to="playlists" replace>
                        Playlists
                    </NavLink>

                    <NavLink to="about" replace>
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
