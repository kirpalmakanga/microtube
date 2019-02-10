import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';

import { getChannel } from '../../actions/youtube';

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
                }
            },
            renderTabs
        } = this;

        return (
            <>
                <div className="channel__info">
                    <div className="channel__info-thumbnail" />
                </div>

                {renderTabs()}

                <Switch>
                    <Route exact path={channelPath} component={ChannelVideos} />

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
            </>
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
    clearData: () => dispatch({ type: 'channel/CLEAR_DATA' }),

    getChannel: (id) => dispatch(getChannel(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Channel);
