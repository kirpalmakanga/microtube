import { createSignal, lazy, onMount, ParentComponent, Show } from 'solid-js';
import { registerSW } from 'virtual:pwa-register';
import Loader from './components/Loader';
import Menu from './components/Menu';
import Notifications from './components/Notifications';
// import Player from './components/player/Player';
import Prompt from './components/prompt/Prompt';
import { IS_DEV_MODE } from './config/app';
import Header from './layout/Header';
// import { enableImportMethods } from './actions.bak/youtube';
import { isMobile, preventDefault } from './lib/helpers';
import { useAuth } from './store/user';
import { useNotifications } from './store/notifications';

const Player = lazy(() => import('./components/player/Player'));

const Root: ParentComponent = (props) => {
    const [user, { bindAccessTokens }] = useAuth();
    const [, { openNotification }] = useNotifications();
    const [isAppReady, setIsAppReady] = createSignal(false);

    onMount(async () => {
        await bindAccessTokens();

        setIsAppReady(true);

        const updateSW = registerSW({
            onNeedRefresh() {
                openNotification(
                    'An update for this app is available, click the reload button to apply.',
                    {
                        callback: () => updateSW(true),
                        callbackButtonText: 'Reload'
                    }
                );
            },
            onOfflineReady() {
                openNotification('Offline mode is active.');
            }
        });
    });

    return (
        <div
            class="relative flex flex-col flex-grow justify-between h-full"
            classList={{ 'is--mobile': isMobile() }}
            onContextMenu={IS_DEV_MODE ? () => {} : preventDefault()}
        >
            <Show when={isAppReady()} fallback={<Loader />}>
                <Header />

                <main class="relative flex flex-col flex-grow overflow-hidden">
                    {props.children}
                </main>

                <Show when={user.isSignedIn}>
                    <Player />

                    <Prompt />

                    <Menu />
                </Show>
            </Show>

            <Notifications />
        </div>
    );
};

export default Root;
