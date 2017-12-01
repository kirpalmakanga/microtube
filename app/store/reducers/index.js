import { combineReducers } from 'redux'

import notifications from './notifications'
import player from './player'
import auth from './auth'
import prompt from './prompt'

export default combineReducers({
  auth,
  notifications,
  player,
  prompt
})
