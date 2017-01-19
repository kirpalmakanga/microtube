// jshint esversion: 6, asi: true
// eslint-env es6

import { combineReducers } from 'redux'
import notifications from './notifications'
import playlists from './playlists'
import playlistItems from './playlistItems'
import video from './video'
import menu from './menu'
import cardMenu from './cardMenu'
import player from './player'
import search from './search'
import auth from './auth'
import prompt from './prompt'

export default combineReducers({
  auth,
  notifications,
  playlists,
  playlistItems,
  video,
  menu,
  cardMenu,
  player,
  search,
  prompt
})
