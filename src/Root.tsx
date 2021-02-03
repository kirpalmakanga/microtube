import './assets/styles/app.scss';

import { useState, useEffect } from 'react';

import { loadAPI, loadAuth } from './api/youtube';

import { useStore } from './store';

// import { enableImportMethods } from './actions.bak/youtube';

import { preventDefault, isMobile } from './lib/helpers';
import { FunctionComponent } from 'react';
import { __DEV__ } from './config/app';

import Header from './layout/Header';

import Head from './components/Head';
import Sprite from './components/Sprite';
import Loader from './components/Loader';
// import Player from './components/player/Player';

// import Prompt from './components/Prompt';
import Notifications from './components/Notifications';
import { useAuth } from './store/hooks/auth';

const Root: FunctionComponent = ({ children }) => {
    const [{ isSignedIn }, { getUserData }] = useAuth();
    const [isAppReady, setIsAppReady] = useState(false);

    useEffect(() => {
        (async () => {
            await loadAPI();
            await loadAuth();

            await getUserData();

            // enableImportMethods();

            // listenForQueueUpdate();

            // connectDevice();

            setIsAppReady(true);
        })();
    }, []);

    return (
        <div
            className={`layout ${isMobile() ? 'mobile' : ''}`}
            onContextMenu={__DEV__ ? () => {} : preventDefault()}
        >
            <Head />

            <Sprite />

            {isAppReady ? (
                <>
                    <Header />

                    <main className="layout__content">{children}</main>

                    <Notifications />
                    {/*
                    {isSignedIn ? <Player /> : null}

                    <Prompt /> */}
                </>
            ) : null}

            <Loader isActive={!isAppReady} />
        </div>
    );
};

export default Root;
