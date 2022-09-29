import { Navigate, Outlet, Route, Routes } from 'solid-app-router';
import { Component, lazy, Show } from 'solid-js';
import Login from './containers/Login';
import Callback from './containers/Callback';
import NotFound from './containers/NotFound';
import { useStore } from './store';

const Protected = () => {
    const [state] = useStore();

    return (
        <Show when={state.user.isSignedIn} fallback={<Login />}>
            <Outlet />
        </Show>
    );
};

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
const Router: Component = () => (
    <Routes>
        <Route path="" element={<Protected />}>
            <Route path="/" element={<Playlists />} />
            <Route path="/playlist/:playlistId" element={<Playlist />} />
            <Route path="/video/:videoId" element={<Video />} />
            <Route path="/search" element={<Search />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/channel/:channelId" element={<Channel />}>
                <Route path="/" element={<Navigate href="videos" />} />
                <Route path="/videos" element={<ChannelVideos />} />
                <Route path="/playlists" element={<ChannelPlaylists />} />
                <Route path="/about" element={<ChannelAbout />} />
            </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />

        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default Router;
