import './assets/styles/app.scss';

import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadAPI, loadAuth, listenAuth, getSignedInUser } from './api/youtube';

import { queueVideos, queuePlaylist } from './actions/youtube';

import AuthRoute from './AuthRoute';

import Header from './layout/Header';
import Playlists from './containers/Playlists';
import Login from './containers/Login';

import asyncComponent from './components/asyncComponent';
import Head from './components/Head';
import Sprite from './components/Sprite';
import Loader from './components/Loader';
import Player from './components/player/Player';

const Playlist = asyncComponent(() => import('./containers/Playlist'));
const Search = asyncComponent(() => import('./containers/Search'));
const Channels = asyncComponent(() => import('./containers/Channels'));
const Channel = asyncComponent(() => import('./containers/Channel'));

class Root extends Component {
    state = { apiLoaded: false };

    initApp = async () => {
        await loadAPI();

        await loadAuth();

        this.props.signIn();

        this.props.listenAuthChange();

        this.setState({ apiLoaded: true });

        const { queueVideos, queuePlaylist } = this.props;

        if (!window.queueVideos) {
            window.queueVideos = queueVideos;
        }

        if (!window.queuePlaylist) {
            window.queuePlaylist = queuePlaylist;
        }
    };

    componentDidMount() {
        this.initApp();
    }

    render() {
        const {
            props: { isLoading },
            state: { apiLoaded }
        } = this;

        return (
            <div className="layout">
                <Head />

                <Sprite />

                {apiLoaded ? (
                    <>
                        <Header />
                        <Switch>
                            <AuthRoute exact path="/" component={Playlists} />

                            <AuthRoute
                                path="/playlist/:playlistId"
                                component={Playlist}
                            />

                            <Route exact path="/search" component={Search} />

                            <Route path="/search/:query" component={Search} />

                            <AuthRoute
                                exact
                                path="/subscriptions"
                                component={Channels}
                            />

                            <Route
                                exact
                                path="/channel/:channelId"
                                component={Channel}
                            />

                            <Route path="/login" component={Login} />
                        </Switch>
                    </>
                ) : null}

                <Player />

                <Loader
                    isActive={!apiLoaded || isLoading}
                    style={isLoading ? { opacity: 0.5 } : {}}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ app: { isLoading } }) => ({ isLoading });

const mapDispatchToProps = (dispatch) => ({
    listenAuthChange: () =>
        listenAuth((data) => dispatch({ type: 'auth/SIGN_IN', data })),

    signIn: () => {
        const data = getSignedInUser();

        dispatch({ type: 'auth/SIGN_IN', data });
    },

    queueVideos: (ids) => dispatch(queueVideos(ids)),

    queuePlaylist: (data) => dispatch(queuePlaylist(data))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Root)
);
