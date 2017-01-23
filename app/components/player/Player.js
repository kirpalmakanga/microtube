// jshint esversion: 6, asi: true
// eslint-env es6

import React from 'react'
import moment from 'moment'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'

function getPlayerTime(time) {
  let hours, minutes, seconds

  function format(int) {
    return ('0' + int).slice(-2)
  }

  hours = Math.floor(time / 3600) % 24

  time  = time - hours * 3600

  minutes = Math.floor(time / 60) % 60

  time  = time - minutes * 60

  seconds = Math.floor(time)

  return [hours, minutes, seconds].map(t => format(t)).join(':')
}

const Player = ({ player, dispatch }) => {
  const currentTime = player.currentTime
  const duration = player.duration

  const currentIndex = player.queue.reduce((result, item, i) => {
    if (player.video.videoId === item.videoId) {
      return i
    }
    return result
  }, 0)

  const previousVideo = player.queue[currentIndex - 1]
  const nextVideo = player.queue[currentIndex + 1]

  const timeProgress = {
    transform: 'translateX(' + parseFloat((currentTime / duration * 100) - 100).toFixed(2) + '%)'
  }

  const loadProgress = {
    transform: 'translateX(' + parseFloat((player.loaded * 100) - 100).toFixed(2) + '%)'
  }

  function isEmpty(obj) {
    return Object.keys(obj).length
  }

  return (
    <div className='mdl-player mdl-shadow--2dp'>
      <div className='mdl-player__controls'>
        <button
          className='mdl-player__controls-button'
          onClick={() => {
            if(previousVideo) {

              dispatch({ type: 'CLEAR_WATCHERS' })

              dispatch({
                type: 'PLAY',
                data: previousVideo,
                skip: true
              })
            }
          }}
        >
          <svg><use xlinkHref='#icon-skip-previous'></use></svg>
        </button>

        <button
          className={['mdl-player__controls-button', player.isBuffering ? 'is-buffering' : player.isPlaying ? 'is-playing': 'is-paused' ].join(' ')}
          onClick={() => {
            if (player.isBuffering) {
              return
            } else if (player.isPlaying) {
              player.youtube.pauseVideo()
            } else {
              player.youtube.playVideo()
            }

            dispatch({
              type: player.isPlaying ? 'PAUSE': 'PLAY',
            })
          }}
        >
          <span className='icon'>
            <svg className='buffer loading'><use xlinkHref='#icon-loading'></use></svg>
          </span>

          <span className='icon'>
            <svg className='pause'><use xlinkHref='#icon-pause'></use></svg>
          </span>

          <span className='icon'>
            <svg className='play'><use xlinkHref='#icon-play'></use></svg>
          </span>
        </button>

        <button
          className='mdl-player__controls-button'
          onClick={() => {
            if(nextVideo) {
              dispatch({ type: 'CLEAR_WATCHERS' })

              dispatch({
                type: 'PLAY',
                data: nextVideo,
                skip: true
              })
            }
          }}
        >
          <svg><use xlinkHref='#icon-skip-next'></use></svg>
        </button>
      </div>

      <div className='mdl-player__info'>
        <div className='mdl-player__info-progress'>
          <div className='mdl-player__info-progress-gutter'>
            <div className='mdl-player__info-progress-loaded' style={loadProgress}></div>
            <div className='mdl-player__info-progress-played' style={timeProgress}></div>
          </div>
        </div>

        <DocumentTitle title={player.video.title || 'Youtube Lite'}>
          <div className='mdl-player__info-title'>
            {player.video.title || 'No video.'}
          </div>
        </DocumentTitle>

        <div className='mdl-player__info-time'>
          <span>{getPlayerTime(currentTime) || '00:00:00'}</span>
          <span className="separator">/</span>
          <span>{getPlayerTime(duration) || '00:00:00'}</span>
        </div>

        <input
          className='mdl-player__info-progress-loaded'
          type='range'
          min='0'
          max='100'
          onChange={({target}) => {
            const newTime = duration * (target.value / 100)

            if (isEmpty(player.youtube)) {
              player.youtube.seekTo(newTime)
              dispatch({
                type: 'UPDATE_TIME',
                currentTime: newTime
              })
            }
          }}
        />
      </div>

      <div className='mdl-player__controls'>
        <button
          className={[
            'mdl-player__controls-button mdl-badge',
            player.showQueue ? 'is-active' : '',
            player.newQueueItems ? 'mdl-badge--active' : '',
          ].join(' ')}
          onClick={() => dispatch({ type: player.showQueue ? 'QUEUE_CLOSE' : 'QUEUE_OPEN' })}
          data-badge={player.newQueueItems}
        >
          <svg><use xlinkHref='#icon-list'></use></svg>
        </button>

        <button
          className={['mdl-player__controls-button', player.showScreen ? 'is-active' : ''].join(' ')}
          onClick={() => dispatch({ type: player.showScreen ? 'SCREEN_CLOSE' : 'SCREEN_OPEN' })}
        >
          <svg><use xlinkHref='#icon-film'></use></svg>
        </button>

        <div
          className='mdl-player__controls-volume'
          onMouseEnter={() => dispatch({ type: 'OPEN_VOLUME' })}
          onMouseLeave={() => dispatch({ type: 'CLOSE_VOLUME' })}
        >
          <button
            className='mdl-player__controls-button'
            onClick={() => dispatch({ type: player.isMuted ? 'UNMUTE' : 'MUTE' })}
            onWheel={({ deltaY }) => {
              if (isEmpty(player.youtube)) {
                dispatch({
                  type: 'SET_VOLUME',
                  data: deltaY < 0 ? player.volume + 5 : player.volume - 5
                })
              }
            }}
          >
            {player.isMuted ? (
              <svg><use xlinkHref='#icon-volume-mute'></use></svg>
            ) : player.volume >= 50 ? (
              <svg><use xlinkHref='#icon-volume-up'></use></svg>
            ) : player.volume > 0 && player.volume <= 50 ? (
              <svg><use xlinkHref='#icon-volume-down'></use></svg>
            ) : (
              <svg><use xlinkHref='#icon-volume-off'></use></svg>
            ) }

          </button>

          <div
            className='mdl-player__controls-volume-range'
            onWheel={({ deltaY }) => {
              if (isEmpty(player.youtube)) {
                dispatch({
                  type: 'SET_VOLUME',
                  data: deltaY < 0 ? player.volume + 5 : player.volume - 5
                })
              }
            }}
          >
            <input
              type='range'
              min='0'
              max='100'
              value={player.volume}
              onChange={({ target }) => {
                dispatch({
                  type: 'SET_VOLUME',
                  data: target.value
                })
              }} />
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Player)
