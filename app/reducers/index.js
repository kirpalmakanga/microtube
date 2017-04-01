import notifications from './notifications'
import playlists from './playlists'
import playlistItems from './playlistItems'
import player from './player'
import search from './search'
import auth from './auth'
import prompt from './prompt'
import subscriptions from './subscriptions'

const { combineReducers } = Redux

export default combineReducers({
  auth,
  notifications,
  playlists,
  playlistItems,
  player,
  search,
  prompt,
  subscriptions
})
