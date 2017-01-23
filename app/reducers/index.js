// jshint esversion: 6, asi: true
// eslint-env es6

import notifications from './notifications'
import playlists from './playlists'
import playlistItems from './playlistItems'
import video from './video'
import player from './player'
import search from './search'
import auth from './auth'
import prompt from './prompt'

const { combineReducers } = Redux

export default combineReducers({
  auth,
  notifications,
  playlists,
  playlistItems,
  video,
  player,
  search,
  prompt
})
