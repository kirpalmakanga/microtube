import './assets/styles/app.scss';

import { Component } from 'react';

import { connect } from 'react-redux';
import { loadAPI, getAuthInstance as loadAuth } from './api/youtube';

import { queueVideos, queuePlaylist, getUserData } from './actions/youtube';

import { preventDefault, isMobile } from './lib/helpers';

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
            props: { children },
            state: { apiLoaded }
        } = this;

        return (
            <div
                className={`layout ${isMobile() ? 'mobile' : ''}`}
                onContextMenu={preventDefault()}
            >
                <Head />

                <Sprite />

                {apiLoaded ? (
                    <>
                        <Header />

                        <main className="layout__content">{children}</main>

                        <Notifications />

                        <Player />
                    </>
                ) : null}

                <Prompt />

                <Loader isActive={!apiLoaded} />
            </div>
        );
    }
}

const mapDispatchToProps = {
    queueVideos,
    queuePlaylist,
    getUserData
};

export default connect(() => ({}), mapDispatchToProps)(Root);
