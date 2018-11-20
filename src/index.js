import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import Root from './Root';

import configureStore from './store/configureStore';

if (process.env.NODE_ENV === 'production') {
    require('../pwa');
}

(() => {
    const appContainer = document.querySelector('#app');
    const store = configureStore();

    render(
        <Provider store={store}>
            <BrowserRouter>
                <Root />
            </BrowserRouter>
        </Provider>,
        appContainer
    );
})();
