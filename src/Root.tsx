import { onMount, createSignal, Show, Component } from 'solid-js';
import { Transition } from 'solid-transition-group';

// import { enableImportMethods } from './actions.bak/youtube';

import { preventDefault, isMobile } from './lib/helpers';
import { __DEV__ } from './config/app';

import Header from './layout/Header';
import Sprite from './components/Sprite';
import Loader from './components/Loader';
import Player from './components/player/Player';
import Prompt from './components/prompt/Prompt';
import Notifications from './components/Notifications';
import { useAuth } from './store/hooks/auth';

const Root: Component = (props) => {
    const [auth, { getUserData }] = useAuth();
    const [isAppReady, setIsAppReady] = createSignal(false);

    onMount(async () => {
        await getUserData();

        setIsAppReady(true);
    });

    return (
        <div
            className="layout"
            classList={{ 'is--mobile': isMobile() }}
            onContextMenu={__DEV__ ? () => {} : preventDefault()}
        >
            <Sprite />

            <Show when={isAppReady()} fallback={<Loader />}>
                <Header />

                <main className="layout__content">{props.children}</main>

                <Notifications />

                <Show when={auth.isSignedIn}>
                    <Player />
                </Show>

                <Prompt />
            </Show>
        </div>
    );
};

export default Root;
