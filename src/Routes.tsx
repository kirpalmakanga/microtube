import { Navigate, Outlet, Route, Routes } from '@solidjs/router';
import { Component, lazy, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';

import Login from './containers/Login';
import Callback from './containers/Callback';
import NotFound from './containers/NotFound';

import Playlists from './containers/Playlists';
import Playlist from './containers/Playlist';
import Video from './containers/Video';
import Search from './containers/Search';
import Subscriptions from './containers/Subscriptions';
import Channel from './containers/Channel';
import ChannelVideos from './containers/Channel/ChannelVideos';
import ChannelPlaylists from './containers/Channel/ChannelPlaylists';
import ChannelAbout from './containers/Channel/ChannelAbout';

import { useStore } from './store';

const Protected = () => {
    const [state] = useStore();

    return (
        <Show when={state.user.isSignedIn} fallback={<Login />}>
            <Outlet />
        </Show>
    );
};

const Router: Component = () => (
    <Transition name="fade" mode="outin">
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
    </Transition>
);

export default Router;
