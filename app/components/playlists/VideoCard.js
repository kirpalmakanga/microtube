// jshint esversion: 6, asi: true
// eslint-env es6
import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'

const VideoCard = ({ video, dispatch }) => {
  console.log('video', video)
  const { videoId, title, publishedAt } = video

  return (
    <div className='card mdl-shadow--2dp'>
      <div className='card__text'>
        <h2 className='card__text-title'>{title}</h2>
        <p className='card__text-subtitle'>{moment(publishedAt).format('MMMM Do YYYY')}</p>
      </div>

      <button
        className='card__button'
        onClick={() => dispatch({
          type: 'QUEUE_PUSH',
          data: video
        })}
      >
        <svg><use xlinkHref='#icon-queue'></use></svg>
      </button>

      <button
        className='card__button'
        onClick={() => {
          dispatch({ type: 'CLEAR_WATCHERS' })

          dispatch({
            type: 'QUEUE_PUSH',
            data: video
          })

          dispatch({
            type: 'PLAY',
            data: video,
            skip: true
          })
        }}
      >
        <svg><use xlinkHref='#icon-play'></use></svg>
      </button>
    </div>
  )
}

export default connect()(VideoCard)
