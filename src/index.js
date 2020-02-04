import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import initReactFastclick from 'react-fastclick';

import Root from './Root';
import Routes from './Routes';

import configureStore from './store/configureStore';

(() => {
    const appContainer = document.querySelector('#app');
    const store = configureStore();

    initReactFastclick();

    render(
        <Provider store={store}>
            <Router>
                <Root>
                    <Routes />
                </Root>
            </Router>
        </Provider>,
        appContainer
    );
})();
