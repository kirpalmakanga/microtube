import './assets/styles/app.scss';

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { loadAPI, loadAuth } from './api/youtube';

import {
    queueVideos,
    queuePlaylist,
    closeScreen,
    getUserData
} from './actions/youtube';

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
        const { getUserData, queueVideos, queuePlaylist } = this.props;

        await loadAPI();

        await loadAuth();

        await getUserData();

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

const mapDispatchToProps = {
    queueVideos,
    queuePlaylist,
    getUserData,
    closeScreen
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Root);
