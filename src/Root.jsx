import './assets/styles/app.scss';

import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

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

const Root = ({ children }) => {
    const dispatch = useDispatch();
    const isSignedIn = useSelector(({ auth: { isSignedIn } }) => isSignedIn);

    const [isAppReady, setIsAppReady] = useState(false);

    const init = async () => {
        await dispatch(initializeApp());

        await dispatch(getUserData());

        dispatch(enableImportMethods());

        setIsAppReady(true);
    };

    useEffect(() => init(), []);

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

                    {isSignedIn ? <Player /> : null}

                    <Prompt />
                </>
            ) : null}

            <Loader isActive={!isAppReady} />
        </div>
    );
};

export default Root;
