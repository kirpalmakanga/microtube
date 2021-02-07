import { Routes, Route } from 'react-router-dom';

import LazyComponent from './components/LazyComponent';

import AuthRoute from './AuthRoute';

import Playlists from './containers/Playlists';
import Login from './containers/Login';
import NotFound from './containers/NotFound';

// import ChannelVideos from './containers/Channel/ChannelVideos';
// import ChannelAbout from './containers/Channel/ChannelAbout';

const Playlist = LazyComponent(() => import('./containers/Playlist'));
// const Search = LazyComponent(() => import('./containers/Search'));
// const Channels = LazyComponent(() => import('./containers/Channels'));

// const Channel = LazyComponent(() => import('./containers/Channel'));
// const Video = LazyComponent(() => import('./containers/Video'));

const Router = () => (
    <Routes>
        <AuthRoute path="/" element={<Playlists />} />

        <AuthRoute path="/playlist/:playlistId" element={<Playlist />} />

        {/*<AuthRoute path="/subscriptions" element={<Channels />} />

        <AuthRoute path="/search/" element={<Search />} />

        <AuthRoute path="/search/:query" element={<Search />} />

        <AuthRoute path="/channel/:channelId/*" element={<Channel />}>
            <Route path="" element={<ChannelVideos />} />

            <Route path="playlists" element={<Playlists />} />

            <Route path="about" element={<ChannelAbout />} />
        </AuthRoute>

        <AuthRoute path="/video/:videoId" element={<Video />} /> */}

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default Router;
