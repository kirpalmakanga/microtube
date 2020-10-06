import { useEffect } from './react';
import { useDispatch, useSelector } from './react-redux';
import { Outlet, NavLink, useParams } from './react-router-dom';

import { getThumbnails } from '../../lib/helpers';

import { getChannel, clearChannelData } from '../../actions/youtube';

import Img from '../../components/Img';

const Tab = ({ children }, index) => (
    <li key={index} className="tab">
        {children}
    </li>
);

const Tabs = ({ children }) => (
    <ul className="tabs">
        {children.map((content, index) => (
            <Tab key={index}>{content}</Tab>
        ))}
    </ul>
);

const Channel = () => {
    const { channelId } = useParams();

    const { channelTitle, thumbnails } = useSelector(
        ({ channel: { channelTitle, thumbnails } }) => ({
            channelTitle,
            thumbnails
        })
    );

    const dispatch = useDispatch();

    const handleGetChannel = () => dispatch(getChannel(channelId));
    const handleClearChannelData = () => dispatch(clearChannelData());

    useEffect(() => {
        handleGetChannel();

        return handleClearChannelData;
    }, []);

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
                    </div>
                </div>

                <Tabs>
                    <NavLink to="" replace>
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
