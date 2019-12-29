import { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';

import { getThumbnails } from '../../lib/helpers';

import { getChannel, clearChannelData } from '../../actions/youtube';

import Img from '../../components/Img';

import ChannelVideos from './ChannelVideos';
import ChannelAbout from './ChannelAbout';

import Playlists from '../Playlists';

class Tabs extends Component {
    renderTab = ([title, href], index) => {
        const isActive = href === this.props.activePath;

        return (
            <li
                key={index}
                className="tab"
                data-state={isActive ? 'active' : 'inactive'}
            >
                <Link to={href} onClick={(e) => isActive && e.preventDefault()}>
                    {title}
                </Link>
            </li>
        );
    };

    render() {
        const {
            props: { data },
            renderTab
        } = this;

        return <ul className="tabs">{Object.entries(data).map(renderTab)}</ul>;
    }
}

class Channel extends Component {
    componentDidMount() {
        const {
            match: {
                params: { channelId }
            }
        } = this.props;

        this.props.getChannel(channelId);
    }

    componentWillUnmount() {
        this.props.clearChannelData();
    }

    getTabData = () => {};

    renderTabs = () => {
        const { channelRoute, currentRoute } = this.props;

        const tabs = {
            Videos: channelRoute,

            Playlists: `${channelRoute}/playlists`,

            About: `${channelRoute}/about`
        };

        return <Tabs data={tabs} activePath={currentRoute} />;
    };

    render() {
        const {
            props: { channelId, channelPath, channelTitle, thumbnails },
            renderTabs
        } = this;

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

                    {renderTabs()}
                </div>

                <div className="channel__content">
                    <Switch>
                        <Route
                            exact
                            path={channelPath}
                            component={ChannelVideos}
                        />

                        <Route
                            path={`${channelPath}/playlists`}
                            component={(props) => (
                                <Playlists {...props} channelId={channelId} />
                            )}
                        />
                        <Route
                            path={`${channelPath}/about`}
                            component={ChannelAbout}
                        />
                    </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (
    { channel: { channelTitle, thumbnails } },
    {
        match: {
            params: { channelId },
            path: channelPath,
            url: channelRoute
        },
        location: { pathname: currentRoute }
    }
) => ({
    channelId,
    channelPath,
    channelRoute,
    currentRoute,
    channelTitle,
    thumbnails
});

const mapDispatchToProps = { getChannel, clearChannelData };

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
