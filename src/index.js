import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import AuthRoute from './AuthRoute';

import Root from './Root';

import asyncComponent from './components/asyncComponent';

import Playlists from './containers/Playlists';
import Login from './containers/Login';

const Playlist = asyncComponent(() => import('./containers/Playlist'));
const Search = asyncComponent(() => import('./containers/Search'));
const Channels = asyncComponent(() => import('./containers/Channels'));
const Channel = asyncComponent(() => import('./containers/Channel'));
const Feed = asyncComponent(() => import('./containers/Feed'));

import { STORAGE_KEY } from './config/app';

import configureStore from './store/configureStore';

const { auth = {}, player = {} } = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || '{}'
);

const initialState = {
    auth: {
        user: {
            userName: '',
            picture: ''
        },
        ...auth
    },
    player: {
        queue: [],
        currentIndex: -1,
        showQueue: false,
        showScreen: false,
        volume: 100,
        newQueueItems: 0,
        ...player
    }
};

(() => {
    const appContainer = document.querySelector('#app .layout__container');
    const appLoader = document.querySelector('.loader');

    const store = configureStore(initialState);

    render(
        <Provider store={store}>
            <Root>
                <BrowserRouter>
                    <Switch>
                        <AuthRoute exact path="/" component={Playlists} />

                        <AuthRoute
                            path="/playlist/:playlistId"
                            component={Playlist}
                        />

                        <Route exact path="/search" component={Search} />

                        <Route path="/search/:query" component={Search} />

                        <AuthRoute
                            exact
                            path="/subscriptions"
                            component={Channels}
                        />

                        <Route
                            exact
                            path="/channel/:channelId"
                            component={Channel}
                        />

                        <AuthRoute path="/feed" component={Feed} />

                        <Route path="/login" component={Login} />
                    </Switch>
                </BrowserRouter>
            </Root>
        </Provider>,
        appContainer
    );

    appLoader.classList.remove('is-active');
})();
