import { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { Outlet, NavLink, useParams } from 'react-router-dom';

import { getThumbnails } from '../../lib/helpers';

import { getChannel, clearChannelData } from '../../actions/youtube';

import Img from '../../components/Img';

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
                <Outlet />
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
