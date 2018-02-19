import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import Router from 'preact-router'
import AsyncRoute from 'preact-async-route'

import configureStore from './store/configureStore'

import App from './App'
import Playlists from 'containers/Playlists'

const makeGetComponent = (path) => async () => {
    const module = await System.import(path + '.tsx')
    return module.default
}

const initialState = {
    auth: {
        token: null,
        refresh: null,
        user: {}
    },
    player: {
        queue: [],
        isPlaying: false,
        isBuffering: false,
        showQueue: false,
        showScreen: false,
        showVolume: false,
        isMuted: false,
        volume: 100,
        video: {
            videoId: null
        },
        loaded: 0,
        currentTime: 0,
        duration: 0,
        youtube: {},
        watchers: {
            time: null,
            loading: null
        },
        newQueueItems: 0
    }
}
;(() => {
    const store = configureStore(initialState)

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
                        path="/login"
                        getComponent={makeGetComponent('./containers/Login')}
                    />
                </Router>
            </App>
        </Provider>,
        document.querySelector('.app')
    )
    document.querySelector('.app-loader').classList.remove('app-loader--active')
})()
