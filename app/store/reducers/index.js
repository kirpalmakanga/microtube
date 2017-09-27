import { combineReducers } from 'redux'

import notifications from './notifications'
import playlists from './playlists'
import playlistItems from './playlistItems'
import player from './player'
import search from './search'
import auth from './auth'
import prompt from './prompt'
import subscriptions from './subscriptions'
import channel from './channel'

export default combineReducers({
  auth,
  notifications,
  playlists,
  playlistItems,
  player,
  search,
  prompt,
  subscriptions,
  channel
})
