import { combineReducers } from 'redux';

import app from './app';
import auth from './auth';
import playlists from './playlists';
import playlistItems from './playlistItems';
import channel from './channel';
import subscriptions from './subscriptions';
import search from './search';
import feed from './feed';
import player from './player';
import prompt from './prompt';
import notifications from './notifications';

export default combineReducers({
    app,
    auth,
    playlists,
    playlistItems,
    channel,
    subscriptions,
    search,
    feed,
    notifications,
    player,
    prompt
});
