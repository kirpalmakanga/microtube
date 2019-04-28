import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import AuthRoute from './AuthRoute';

import Playlists from './containers/Playlists';
import Login from './containers/Login';
import NotFound from './containers/NotFound';

import asyncComponent from './components/asyncComponent';

const Playlist = asyncComponent(() => import('./containers/Playlist'));
const Search = asyncComponent(() => import('./containers/Search'));
const Channels = asyncComponent(() => import('./containers/Channels'));
const Channel = asyncComponent(() => import('./containers/channel/Channel'));

class Routes extends Component {
    render() {
        return (
            <Switch>
                <AuthRoute exact path="/" component={Playlists} />

                <AuthRoute path="/playlist/:playlistId" component={Playlist} />

                <Route path="/search/:query" component={Search} />

                <AuthRoute exact path="/subscriptions" component={Channels} />

                <Route path="/channel/:channelId" component={Channel} />

                <Route path="/login" component={Login} />

                <Route path="*" component={NotFound} />
            </Switch>
        );
    }
}

export default Routes;
