import { Switch, Route } from 'react-router-dom';

import LazyComponent from './components/LazyComponent';

import AuthRoute from './AuthRoute';

import Playlists from './containers/Playlists';
import Login from './containers/Login';
import NotFound from './containers/NotFound';

const Playlist = LazyComponent(() => import('./containers/Playlist'));
const Search = LazyComponent(() => import('./containers/Search'));
const Channels = LazyComponent(() => import('./containers/Channels'));
const Channel = LazyComponent(() => import('./containers/channel'));

const Routes = () => (
    <Switch>
        <AuthRoute exact path="/" component={Playlists} />

        <AuthRoute path="/playlist/:playlistId" component={Playlist} />

        <AuthRoute exact path="/subscriptions" component={Channels} />

        <AuthRoute path="/search/:query?" component={Search} />

        <AuthRoute path="/channel/:channelId" component={Channel} />

        <Route path="/login" component={Login} />

        <Route path="*" component={NotFound} />
    </Switch>
);

export default Routes;
