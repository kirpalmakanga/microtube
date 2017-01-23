// jshint esversion: 6, asi: true
// eslint-env es6

import React from 'react'

import Notification from './Notification'

const Notifications = ({ notifications }) => {
  return (
    <div>
      <Notification className={notifications.className} message={notifications.message} url={notifications.url} />
    </div>
  )
}

export default Notifications
