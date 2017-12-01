import { combineReducers } from 'redux'

import notifications from './notifications'
import player from './player'
import search from './search'
import auth from './auth'
import prompt from './prompt'

export default combineReducers({
  auth,
  search,
  notifications,
  player,
  prompt
})
