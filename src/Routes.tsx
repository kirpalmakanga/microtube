import { lazy, Component, Show } from 'solid-js';
import { Navigate, Routes, Route, Outlet } from 'solid-app-router';

import Login from './containers/Login';
import NotFound from './containers/NotFound';
import { useAuth } from './store/hooks/auth';

const Protected = () => {
    const [{ isSignedIn }] = useAuth();

    return (
        <Show when={isSignedIn} fallback={<Login />}>
            <Outlet />
        </Show>
    );
};

const Playlists = lazy(() => import('./containers/Playlists'));
// const Playlist = LazyComponent(() => import('./containers/Playlist'));
// const Video = LazyComponent(() => import('./containers/Video'));
// const Search = LazyComponent(() => import('./containers/Search'));
// const Channels = LazyComponent(() => import('./containers/Channels'));
// const Channel = LazyComponent(() => import('./containers/Channel'));
// const ChannelVideos = LazyComponent(() =>
//     import('./containers/Channel/ChannelVideos')
// );
// const ChannelAbout = LazyComponent(() =>
//     import('./containers/Channel/ChannelAbout')
// );

const Router: Component = () => (
    <Routes>
        <Route path="" element={Protected}>
            <Route path="/" element={Playlists} />
            {/*
            <Route path="/playlist/:playlistId" element={<Playlist />} />

            <Route path="/video/:videoId" element={<Video />} />

            <Route path="/search/" element={<Search />} />

            <Route path="/search/:query" element={<Search />} />

            <Route path="/subscriptions" element={<Channels />} />

            <Route path="/channel/:channelId" element={<Channel />}>
                <Route index element={<Navigate href="videos" />} />

                <Route path="videos" element={<ChannelVideos />} />

                <Route path="playlists" element={<Playlists />} />

                <Route path="about" element={<ChannelAbout />} />
            </Route>
            */}
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default Router;
