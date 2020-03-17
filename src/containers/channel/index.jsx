import { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    Routes,
    Route,
    NavLink,
    useParams,
    useLocation
} from 'react-router-dom';

import { getThumbnails } from '../../lib/helpers';

import { getChannel, clearChannelData } from '../../actions/youtube';

import Img from '../../components/Img';

import ChannelVideos from './ChannelVideos';
import ChannelAbout from './ChannelAbout';

import Playlists from '../Playlists';

class Tabs extends Component {
    renderTab = (content, index) => (
        <li key={index} className="tab">
            {content}
        </li>
    );

    render() {
        const {
            props: { children },
            renderTab
        } = this;

        return <ul className="tabs">{children.map(renderTab)}</ul>;
    }
}

const Channel = ({
    channelTitle,
    thumbnails,
    getChannel,
    clearChannelData
}) => {
    const { channelId } = useParams();

    useEffect(() => {
        getChannel(channelId);

        return clearChannelData;
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
                <Routes>
                    <Route
                        path=""
                        element={<ChannelVideos channelId={channelId} />}
                    />

                    <Route
                        path="playlists"
                        element={<Playlists channelId={channelId} />}
                    />

                    <Route path="about" element={<ChannelAbout />} />
                </Routes>
            </div>
        </div>
    );
};

const mapStateToProps = ({ channel: { channelTitle, thumbnails } }) => ({
    channelTitle,
    thumbnails
});

const mapDispatchToProps = { getChannel, clearChannelData };

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
