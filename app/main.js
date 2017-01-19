// jshint esversion: 6, asi:true
// eslint-env es6
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import configureStore from './store/configureStore'
import getRoutes from './routes'

require('fetch-ponyfill')({ Promise: Promise })

const store = configureStore(window.INITIAL_STATE)

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={getRoutes(store)} />
  </Provider>,
  document.querySelector('.app')
)
