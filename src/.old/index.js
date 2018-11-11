import { STORAGE_KEY } from './config';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { h, render } from 'preact';
import { Provider } from 'preact-redux';

import configureStore from './store/configureStore';

import App from './old/App';
import Router from 'preact-router';
import AsyncRoute from 'preact-async-route';
import Playlists from 'containers/Playlists';

const makeGetComponent = (path) => async () => {
    const module = await System.import(path + '.tsx');
    return module.default;
};

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
    const store = configureStore(initialState);

    render(
        <Provider store={store}>
            <App>
                <Router>
                    <Playlists path="/" />
                    <AsyncRoute
                        path="/playlist/:playlistId"
                        getComponent={makeGetComponent('./containers/Playlist')}
                    />
                    <AsyncRoute
                        path="/subscriptions"
                        getComponent={makeGetComponent('./containers/Channels')}
                    />
                    <AsyncRoute
                        path="/channel/:channelId"
                        getComponent={makeGetComponent('./containers/Channel')}
                    />
                    <AsyncRoute
                        path="/search"
                        getComponent={makeGetComponent('./containers/Search')}
                    />
                    <AsyncRoute
                        path="/search/:query"
                        getComponent={makeGetComponent('./containers/Search')}
                    />
                    {/* <AsyncRoute
                        path="/feed"
                        getComponent={makeGetComponent('./containers/Feed')}
                    /> */}
                </Router>
            </App>
        </Provider>,
        document.querySelector('.app')
    );
    document
        .querySelector('.app-loader')
        .classList.remove('app-loader--active');
})();
