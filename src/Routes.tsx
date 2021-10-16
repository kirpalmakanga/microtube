import { lazy, Component, Show, onMount } from 'solid-js';
import { Navigate, Routes, Route, Outlet } from 'solid-app-router';

import Login from './containers/Login';
import NotFound from './containers/NotFound';
import { useAuth } from './store/hooks/auth';

const Protected = () => {
    const [auth] = useAuth();

    return (
        <Show when={auth.isSignedIn} fallback={<Login />}>
            <Outlet />
        </Show>
    );
};

const Playlists = lazy(() => import('./containers/Playlists'));
const Playlist = lazy(() => import('./containers/Playlist'));
const Video = lazy(() => import('./containers/Video'));
const Search = lazy(() => import('./containers/Search'));
const Channels = lazy(() => import('./containers/Channels'));
const Channel = lazy(() => import('./containers/Channel'));
const ChannelVideos = lazy(() => import('./containers/Channel/ChannelVideos'));
const ChannelAbout = lazy(() => import('./containers/Channel/ChannelAbout'));

const Router: Component = () => (
    <Routes>
        <Route path="" element={<Protected />}>
            <Route path="/" element={<Playlists />} />
            <Route path="/playlist/:playlistId" element={<Playlist />} />
            <Route path="/video/:videoId" element={<Video />} />
            {/* <Route path="/search/" element={<Search />} /> */}
            {/* <Route path="/search/:query" element={<Search />} /> */}
            {/* <Route path="/subscriptions" element={<Channels />} /> */}
            {/* <Route path="/channel/:channelId" element={<Channel />}> */}
            {/* <Route path="" element={<Navigate href="videos" />} /> */}
            {/* <Route path="videos" element={<ChannelVideos />} /> */}
            {/* <Route path="playlists" element={<Playlists />} /> */}
            {/* <Route path="about" element={<ChannelAbout />} /> */}
            {/* </Route> */}
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default Router;
