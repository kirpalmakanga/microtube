// import { combineReducers } from '../helpers';
import { initialState as appInitialState } from './_app';
import { initialState as userInitialState } from './_user';
import { initialState as playerInitialState } from './_player';
import { initialState as playlistsInitialState } from './_playlists';
import { initialState as playlistItemsInitialState } from './_playlist-items';
import { initialState as channelInitialState } from './_channel';
import { initialState as subscriptionsInitialState } from './_subscriptions';
import { initialState as searchInitialState } from './_search';
import { initialState as notificationsInitialState } from './_notifications';
import { initialState as promptInitialState } from './_prompt';

export const rootInitialState = {
    app: appInitialState,
    user: userInitialState,
    player: playerInitialState,
    playlists: playlistsInitialState,
    playlistItems: playlistItemsInitialState,
    channel: channelInitialState,
    subscriptions: subscriptionsInitialState,
    search: searchInitialState,
    notifications: notificationsInitialState,
    prompt: promptInitialState
};
