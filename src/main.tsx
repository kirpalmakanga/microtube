import { lazy, ParentComponent, Show } from 'solid-js';
import { render } from 'solid-js/web';
import { Navigate, Router, Route } from '@solidjs/router';

import 'virtual:windi.css';

import './assets/styles/app.scss';
import Root from './Root';
import { StoreProvider, useStore } from './store';

const Login = lazy(() => import('./containers/Login'));
const Callback = lazy(() => import('./containers/Callback'));
const NotFound = lazy(() => import('./containers/NotFound'));

const Playlists = lazy(() => import('./containers/Playlists'));
const Playlist = lazy(() => import('./containers/Playlist'));
const Video = lazy(() => import('./containers/Video'));
const Search = lazy(() => import('./containers/Search'));
const Subscriptions = lazy(() => import('./containers/Subscriptions'));
const Channel = lazy(() => import('./containers/Channel'));
const ChannelVideos = lazy(() => import('./containers/Channel/ChannelVideos'));
const ChannelPlaylists = lazy(
    () => import('./containers/Channel/ChannelPlaylists')
);
const ChannelAbout = lazy(() => import('./containers/Channel/ChannelAbout'));

const Protected: ParentComponent = (props) => {
    const [state] = useStore();

    return (
        <Show when={state.user.isSignedIn} fallback={<Login />}>
            {props.children}
        </Show>
    );
};

const appContainer = document.querySelector('#app');

if (appContainer) {
    render(
        () => (
            <StoreProvider>
                <Router root={Root}>
                    <Route path="" component={Protected}>
                        <Route path="/" component={Playlists} />
                        <Route
                            path="/playlist/:playlistId"
                            component={Playlist}
                        />
                        <Route path="/video/:videoId" component={Video} />
                        <Route path="/search" component={Search} />
                        <Route
                            path="/subscriptions"
                            component={Subscriptions}
                        />
                        <Route path="/channel/:channelId" component={Channel}>
                            <Route
                                path="/"
                                component={() => <Navigate href="videos" />}
                            />
                            <Route path="/videos" component={ChannelVideos} />
                            <Route
                                path="/playlists"
                                component={ChannelPlaylists}
                            />
                            <Route path="/about" component={ChannelAbout} />
                        </Route>
                    </Route>

                    <Route path="/login" component={Login} />
                    <Route path="/callback" component={Callback} />

                    <Route path="*" component={NotFound} />
                </Router>
            </StoreProvider>
        ),
        appContainer
    );
}
