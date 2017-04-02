import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import { Router, browserHistory } from 'react-router'

import configureStore from './store/configureStore'
import getRoutes from './routes'

const { Provider } = ReactRedux

const store = configureStore(window.INITIAL_STATE)

OfflinePluginRuntime.install()

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory} routes={getRoutes(store)} />
    </Provider>,
    document.querySelector('.app'),
    () => document.querySelector('.app-loader').classList.remove('app-loader--active')
  )
})
