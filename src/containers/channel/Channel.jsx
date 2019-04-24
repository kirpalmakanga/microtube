import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';

import { getThumbnails } from '../../lib/helpers';

import { getChannel } from '../../actions/youtube';

import Img from '../../components/Img';

import ChannelVideos from './ChannelVideos';
import ChannelAbout from './ChannelAbout';

import Playlists from '../Playlists';

class Tabs extends Component {
    renderTab = ([title, href], index) => (
        <li
            key={index}
            className="tab"
            data-state={href === this.props.activePath ? 'active' : 'inactive'}
        >
            <Link to={href}>{title}</Link>
        </li>
    );

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
        this.props.clearData();
    }

    getTabData = () => {};

    renderTabs = () => {
        const {
            match: { url: channelPath },
            location: { pathname: currentPath }
        } = this.props;

        const tabs = {
            Videos: channelPath,

            Playlists: `${channelPath}/playlists`,

            About: `${channelPath}/about`
        };

        return <Tabs data={tabs} activePath={currentPath} />;
    };

    render() {
        const {
            props: {
                match: {
                    params: { channelId },
                    path: channelPath
                },
                channelTitle,
                thumbnails
            },
            renderTabs
        } = this;

        console.log('thumbnails', getThumbnails(thumbnails, 'medium'));

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

const mapStateToProps = ({ channel: { channelTitle, thumbnails } }) => ({
    channelTitle,
    thumbnails
});

const mapDispatchToProps = (dispatch) => ({
    clearData: () => dispatch({ type: 'channel/CLEAR_DATA' }),

    getChannel: (id) => dispatch(getChannel(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Channel);
