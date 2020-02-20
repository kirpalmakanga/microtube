import './assets/styles/app.scss';

import { Component } from 'react';

import { connect } from 'react-redux';

import { initializeApp } from './actions/app';

import { getUserData } from './actions/auth';

import { enableImportMethods } from './actions/youtube';

import { preventDefault, isMobile } from './lib/helpers';

import { __DEV__ } from './config/app';

import Header from './layout/Header';

import Head from './components/Head';
import Sprite from './components/Sprite';
import Loader from './components/Loader';
import Player from './components/player/Player';

import Prompt from './components/Prompt';
import Notifications from './components/Notifications';

class Root extends Component {
    state = { apiLoaded: false };

    init = async () => {
        const { initializeApp, getUserData, enableImportMethods } = this.props;

        await initializeApp();

        await getUserData();

        enableImportMethods();

        this.setState({ apiLoaded: true });
    };

    componentDidMount() {
        this.init();
    }

    render() {
        const {
            props: { children },
            state: { apiLoaded }
        } = this;

        return (
            <div
                className={`layout ${isMobile() ? 'mobile' : ''}`}
                onContextMenu={__DEV__ ? () => {} : preventDefault()}
            >
                <Head />

                <Sprite />

                {apiLoaded ? (
                    <>
                        <Header />

                        <main className="layout__content">{children}</main>

                        <Notifications />

                        <Player />

                        <Prompt />
                    </>
                ) : null}

                <Loader isActive={!apiLoaded} />
            </div>
        );
    }
}

const mapDispatchToProps = {
    initializeApp,
    getUserData,
    enableImportMethods
};

export default connect(() => ({}), mapDispatchToProps)(Root);
