import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';
import './assets/styles/app.scss';
import Root from './Root';
import Routes from './Routes';
import { StoreProvider } from './store';

const appContainer = document.querySelector('#app');

if (appContainer) {
    render(
        () => (
            <StoreProvider>
                <Router>
                    <Root>
                        <Routes />
                    </Root>
                </Router>
            </StoreProvider>
        ),
        appContainer
    );
}
