// import { combineReducers } from '../helpers';
import { AppState, initialState as appInitialState } from './app/_state';
import { initialState as userInitialState, UserState } from './user/_state';
import {
    initialState as playerInitialState,
    PlayerState
} from './player/_state';
import {
    initialState as playlistsInitialState,
    PlaylistsState
} from './playlists/_state';
import {
    initialState as playlistItemsInitialState,
    PlaylistItemsState
} from './playlist-items/_state';
import {
    ChannelState,
    initialState as channelInitialState
} from './channel/_state';
import {
    initialState as subscriptionsInitialState,
    SubscriptionsState
} from './subscriptions/_state';
import {
    initialState as searchInitialState,
    SearchState
} from './search/_state';
import {
    initialState as notificationsInitialState,
    NotificationState
} from './notifications/_state';
import {
    initialState as promptInitialState,
    PromptState
} from './prompt/_state';
import { initialState as menuInitialState, MenuState } from './menu/_state';

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
