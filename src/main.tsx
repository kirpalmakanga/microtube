import { render } from 'solid-js/web';
import { Router } from 'solid-app-router';
import { MetaProvider } from 'solid-meta';

import Root from './Root';
import Routes from './Routes';

import { StoreProvider } from './store';

import './assets/styles/app.scss';

const appContainer = document.querySelector('#app');

if (appContainer) {
    render(
        () => (
            <StoreProvider>
                {() => (
                    <MetaProvider>
                        <Router>
                            <Root>
                                <Routes />
                            </Root>
                        </Router>
                    </MetaProvider>
                )}
            </StoreProvider>
        ),
        appContainer
    );
}
