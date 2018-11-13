import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import Root from './Root';

import asyncComponent from './components/asyncComponent';

import Playlists from './containers/Playlists';

const Playlist = asyncComponent(() => import('./containers/Playlist'));
const Search = asyncComponent(() => import('./containers/Search'));
const Channels = asyncComponent(() => import('./containers/Channels'));
const Channel = asyncComponent(() => import('./containers/Channel'));

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
    const appContainer = document.querySelector('.app');
    const appLoader = document.querySelector('.app-loader');

    const store = configureStore(initialState);

    render(
        <Provider store={store}>
            <Root>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Playlists} />
                        <Route
                            path="/playlist/:playlistId"
                            component={Playlist}
                        />
                        <Route exact path="/search" component={Search} />
                        <Route path="/search/:query" component={Search} />
                        <Route
                            exact
                            path="/subscriptions"
                            component={Channels}
                        />
                        <Route
                            exact
                            path="/channel/:channelId"
                            component={Channel}
                        />
                    </Switch>
                </BrowserRouter>
            </Root>
        </Provider>,
        appContainer
    );

    appLoader.classList.remove('app-loader--active');
})();
