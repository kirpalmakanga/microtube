import './assets/styles/app.scss';

import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import { connect } from 'react-redux';
import { loadAPI, loadAuth, listenAuth, getSignedInUser } from './api/youtube';

import { queueVideos, queuePlaylist } from './actions/youtube';

import Header from './layout/Header';

import Head from './components/Head';
import Sprite from './components/Sprite';
import Loader from './components/Loader';
import Player from './components/player/Player';

import Prompt from './components/Prompt';
import Notifications from './components/Notifications';

class Root extends Component {
    state = { apiLoaded: false };

    initApp = async () => {
        const {
            signIn,
            listenAuthChange,
            queueVideos,
            queuePlaylist
        } = this.props;

        await loadAPI();

        await loadAuth();

        signIn();

        listenAuthChange();

        this.setState({ apiLoaded: true });

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
            props: { isLoading, closeScreen, children },
            state: { apiLoaded }
        } = this;

        return (
            <div className="layout">
                <Head />

                <Sprite />

                {apiLoaded ? (
                    <>
                        <Header onClick={closeScreen} />

                        <main className="layout__content">{children}</main>

                        <Notifications />
                    </>
                ) : null}

                <Player />

                <Prompt />

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
    closeScreen: () =>
        dispatch((_, getState) => {
            const {
                player: { showScreen }
            } = getState();

            showScreen && dispatch({ type: 'player/CLOSE_SCREEN' });
        }),

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
