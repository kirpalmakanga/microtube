import { Navigate, Routes, Route } from 'react-router-dom';

import LazyComponent from './components/LazyComponent';

import AuthRoute from './AuthRoute';

import Playlists from './containers/Playlists';
import Login from './containers/Login';
import NotFound from './containers/NotFound';

const Playlist = LazyComponent(() => import('./containers/Playlist'));
const Video = LazyComponent(() => import('./containers/Video'));
const Search = LazyComponent(() => import('./containers/Search'));
const Channels = LazyComponent(() => import('./containers/Channels'));
const Channel = LazyComponent(() => import('./containers/Channel'));
const ChannelVideos = LazyComponent(() =>
    import('./containers/Channel/ChannelVideos')
);
const ChannelAbout = LazyComponent(() =>
    import('./containers/Channel/ChannelAbout')
);

const Router = () => (
    <Routes>
        <AuthRoute path="/" element={<Playlists />} />

        <AuthRoute path="/playlist/:playlistId" element={<Playlist />} />

        <AuthRoute path="/video/:videoId" element={<Video />} />

        <AuthRoute path="/search/" element={<Search />} />

        <AuthRoute path="/search/:query" element={<Search />} />

        <AuthRoute path="/subscriptions" element={<Channels />} />

        <AuthRoute path="/channel/:channelId/*" element={<Channel />}>
            <Route path="" element={<Navigate to="videos" />} />

            <Route path="videos" element={<ChannelVideos />} />

            <Route path="playlists" element={<Playlists />} />

            <Route path="about" element={<ChannelAbout />} />
        </AuthRoute>

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default Router;
