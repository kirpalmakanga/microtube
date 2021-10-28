// import { combineReducers } from '../helpers';
import { AppState, initialState as appInitialState } from './_app';
import { initialState as userInitialState, UserState } from './_user';
import { initialState as playerInitialState, PlayerState } from './_player';
import {
    initialState as playlistsInitialState,
    PlaylistsState
} from './_playlists';
import {
    initialState as playlistItemsInitialState,
    PlaylistItemsState
} from './_playlist-items';
import { ChannelState, initialState as channelInitialState } from './_channel';
import {
    initialState as subscriptionsInitialState,
    SubscriptionsState
} from './_subscriptions';
import { initialState as searchInitialState, SearchState } from './_search';
import {
    initialState as notificationsInitialState,
    NotificationState
} from './_notifications';
import { initialState as promptInitialState, PromptState } from './_prompt';

import { initialState as menuInitialState, MenuState } from './_menu';

export interface RootState {
    app: AppState;
    user: UserState;
    player: PlayerState;
    playlists: PlaylistsState;
    playlistItems: PlaylistItemsState;
    channel: ChannelState;
    subscriptions: SubscriptionsState;
    search: SearchState;
    notifications: NotificationState;
    prompt: PromptState;
    menu: MenuState;
}

export const rootInitialState = (): RootState => ({
    app: appInitialState(),
    user: userInitialState(),
    player: playerInitialState(),
    playlists: playlistsInitialState(),
    playlistItems: playlistItemsInitialState(),
    channel: channelInitialState(),
    subscriptions: subscriptionsInitialState(),
    search: searchInitialState(),
    notifications: notificationsInitialState(),
    prompt: promptInitialState(),
    menu: menuInitialState()
});
