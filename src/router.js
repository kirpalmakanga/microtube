import { h } from 'preact'
import Router from 'preact-router'

import AsyncRoute from 'preact-async-route'

import Playlists from 'containers/Playlists'

const makeGetComponent = (path) => async () => {
    const module = await System.import(path + '.tsx')
    return module.default
}

export default () => (
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
    </Router>
)
