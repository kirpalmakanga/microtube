import { combineReducers } from '../helpers';
import app, { initialState as appInitialState } from './_app';
import user, { initialState as userInitialState } from './_user';
import player, { initialState as playerInitialState } from './_player';
import playlists, { initialState as playlistsInitialState } from './_playlists';
import playlistItems, {
    initialState as playlistItemsInitialState
} from './_playlist-items';
import channel, { initialState as channelInitialState } from './_channel';
import subscriptions, {
    initialState as subscriptionsInitialState
} from './_subscriptions';
import search, { initialState as searchInitialState } from './_search';
import notifications, {
    initialState as notificationsInitialState
} from './_notifications';
import prompt, { initialState as promptInitialState } from './_prompt';

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

export default combineReducers({
    app,
    user,
    player,
    playlists,
    playlistItems,
    channel,
    subscriptions,
    search,
    notifications,
    prompt
});
