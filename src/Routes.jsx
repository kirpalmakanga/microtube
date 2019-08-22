import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

import WaitingComponent from './components/WaitingComponent';

import AuthRoute from './AuthRoute';

import Playlists from './containers/Playlists';
import Login from './containers/Login';
import NotFound from './containers/NotFound';

const Playlist = WaitingComponent(lazy(() => import('./containers/Playlist')));
const Search = WaitingComponent(lazy(() => import('./containers/Search')));
const Channels = WaitingComponent(lazy(() => import('./containers/Channels')));
const Channel = WaitingComponent(lazy(() => import('./containers/channel')));

const Routes = () => (
    <Switch>
        <AuthRoute exact path="/" component={Playlists} />

        <AuthRoute path="/playlist/:playlistId" component={Playlist} />

        <AuthRoute exact path="/subscriptions" component={Channels} />

        <AuthRoute path="/search/:query?" component={Search} />

        <AuthRoute path="/channel/:channelId" component={Channel} />

        <Route path="/login" component={Login} />

        <Route path="*" component={NotFound} />
    </Switch>
);

export default Routes;
