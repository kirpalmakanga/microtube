// jshint esversion: 6, asi: true
// eslint-env es6

import React from 'react'
import { connect } from 'react-redux'

const Queue = ({ player, dispatch }) => {
  return (
    <div className={['queue mdl-shadow--2dp', player.showQueue ? 'queue--show': ''].join(' ')}>
      <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row'>
            <span className='mdl-layout-title'>{'Queue (' + player.queue.length + ' Elements)'}</span>
            <div className='mdl-layout-spacer'></div>
            <nav className='mdl-navigation'>
              <button className='mdl-navigation__link' onClick={() => {
                dispatch({
                  type: 'PROMPT_CLEAR_QUEUE',
                  callback: () => {
                    dispatch({ type: 'QUEUE_CLEAR' })
                    dispatch({ type: 'PROMPT_CLOSE' })
                  }
                })
              }}>
                <svg><use xlinkHref='#icon-clear'></use></svg>
              </button>
            </nav>
          </div>
      </header>

      {player.queue.map((item, i) => {
        const isCurrentVideo = (player.video.videoId === item.videoId)
        return (
          <div
            key={i}
            className={['queue__item', isCurrentVideo ? 'is-active' : ''].join(' ')}
          >
            <span className='queue__item-title'>{item.title}</span>

            {!isCurrentVideo ? (
              <button
                className='queue__item-button'
                onClick={() => {
                  dispatch({ type: 'CLEAR_WATCHERS' })

                  dispatch({
                    type: 'PLAY',
                    data: item,
                    skip: true
                  })
                }}
              >
                <svg><use xlinkHref='#icon-play'></use></svg>
              </button>
            ) : null}

            <button
              className='queue__item-button'
              onClick={() => dispatch({
                type: 'QUEUE_MOVE',
                index: i,
                direction: -1
              })}
            >
              <svg><use xlinkHref='#icon-up'></use></svg>
            </button>

            <button
              className='queue__item-button'
              onClick={() => dispatch({
                type: 'QUEUE_MOVE',
                index: i,
                direction: +1
              })}
            >
              <svg><use xlinkHref='#icon-down'></use></svg>
            </button>

            <button
              className='queue__item-button'
              onClick={() => dispatch({
                type: 'QUEUE_REMOVE',
                index: i
              })}
            >
              <svg><use xlinkHref='#icon-close'></use></svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    player: state.player
  }
}

export default connect(mapStateToProps)(Queue)
