import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// import initReactFastclick from 'react-fastclick';

import Root from './Root';
import Routes from './Routes';

import Store from './store';

(() => {
    const appContainer = document.querySelector('#app');

    // initReactFastclick();

    render(
        <Store>
            <Router>
                <Root>
                    <Routes />
                </Root>
            </Router>
        </Store>,
        appContainer
    );
})();
