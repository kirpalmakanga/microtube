import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import { h, render } from 'preact'
import { Provider } from 'preact-redux'

import configureStore from './store/configureStore'

import App from './App'
import AppRouter from './router'

import { STORAGE_KEY } from './config'

const { auth = {}, player = {} } = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || '{}'
)

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
}
;(() => {
    const store = configureStore(initialState)

    render(
        <Provider store={store}>
            <App>
                <AppRouter />
            </App>
        </Provider>,
        document.querySelector('.app')
    )
    document.querySelector('.app-loader').classList.remove('app-loader--active')
})()
