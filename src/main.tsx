import { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Root from './Root';
import Routes from './Routes';

import Store from './store';

const appContainer = document.querySelector('#app');

render(
    <StrictMode>
        <Store>
            <Router>
                <Root>
                    <Routes />
                </Root>
            </Router>
        </Store>
    </StrictMode>,
    appContainer
);
