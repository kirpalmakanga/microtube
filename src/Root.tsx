import { Component, createSignal, onMount, Show } from 'solid-js';
import { registerSW } from 'virtual:pwa-register';
import Loader from './components/Loader';
import Menu from './components/Menu';
import Notifications from './components/Notifications';
import Player from './components/player/Player';
import Prompt from './components/prompt/Prompt';
import Sprite from './components/Sprite';
import { __DEV__ } from './config/app';
import Header from './layout/Header';
// import { enableImportMethods } from './actions.bak/youtube';
import { isMobile, preventDefault } from './lib/helpers';
import { useAuth } from './store/user';
import { useNotifications } from './store/notifications';

const Root: Component = (props) => {
    const [user, { getUserData }] = useAuth();
    const [, { openNotification }] = useNotifications();
    const [isAppReady, setIsAppReady] = createSignal(false);

    onMount(async () => {
        await getUserData();

        setIsAppReady(true);

        const updateSW = registerSW({
            onNeedRefresh() {
                openNotification(
                    'An update for this app is available, click the reload button to apply.',
                    {
                        // @ts-ignore
                        callback: () => location.reload(true),
                        callbackButtonText: 'Reload'
                    }
                );
            },
            onOfflineReady() {
                openNotification('Offline mode is active.');
            }
        });

        updateSW();
    });

    return (
        <>
            <Sprite />

            <div
                className="layout"
                classList={{ 'is--mobile': isMobile() }}
                onContextMenu={__DEV__ ? () => {} : preventDefault()}
            >
                <Show when={isAppReady()} fallback={<Loader />}>
                    <Header />

                    <main className="layout__content">{props.children}</main>

                    <Notifications />

                    <Show when={user.isSignedIn}>
                        <Player />

                        <Prompt />

                        <Menu />
                    </Show>
                </Show>
            </div>
        </>
    );
};

export default Root;
