import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import Root from './Root';

import { STORAGE_KEY } from './config/app';

import configureStore from './store/configureStore';

const { auth = {}, player = {} } = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || '{}'
);

const initialState = {
  auth: {
    user: {
      userName: '',
      picture: ''
    },
    ...auth
  },
  player: {
    queue: [],
    currentIndex: -1,
    showQueue: false,
    showScreen: false,
    volume: 100,
    newQueueItems: 0,
    ...player
  }
};

if (process.env.NODE_ENV === 'production') {
  require('../pwa');
}

(() => {
  const appContainer = document.querySelector('#app .layout__container');
  const appLoader = document.querySelector('.loader');

  const store = configureStore(initialState);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </Provider>,
    appContainer
  );

  appLoader.classList.remove('is-active');
})();
