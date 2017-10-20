const { h } = require('preact')
const render = require('preact-render-to-string')
/** @jsx h */

const App = require('./components/App')
const Playlists = require('./components/containers/Playlists')
const Playlist = require('./components/containers/Playlist')
const Subscriptions = require('./components/containers/Subscriptions')
const Channel = require('./components/containers/Channel')

exports.module = function renderApp(path) {
  let child = Playlists

  switch (path) {
    case 'playlist':
      child = Playlist
    break;

    case 'subscriptions':
      child = Subscriptions
    break;

    case 'channel':
      child = Channel
    break;
  }

  return render(<App children={child} />)
}
