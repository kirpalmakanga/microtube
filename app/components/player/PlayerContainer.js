// jshint esversion: 6, asi: true
// eslint-env es6

import React from 'react'
import Player from './Player'
import Queue from './Queue'
import Screen from './Screen'

const PlayerContainer = () => (
  <div className='mdl-player__container'>
    <Queue />
    <Screen />
    <Player />
  </div>
)

export default PlayerContainer
