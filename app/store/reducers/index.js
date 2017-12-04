import { combineReducers } from 'redux'

import auth from './auth'
import playlists from './playlists'
import playlistItems from './playlistItems'
import channel from './channel'
import subscriptions from './subscriptions'
import search from './search'
import player from './player'
import prompt from './prompt'
import notifications from './notifications'

export default combineReducers({
  auth,
  playlists,
  playlistItems,
  channel,
  subscriptions,
  search,
  notifications,
  player,
  prompt
})
