import './assets/styles/app.scss';

import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadAPI, loadAuth, listenAuth, getSignedInUser } from './api/youtube';

import AuthRoute from './AuthRoute';

import Header from './layout/Header';
import Playlists from './containers/Playlists';
import Login from './containers/Login';

const Playlist = asyncComponent(() => import('./containers/Playlist'));
const Search = asyncComponent(() => import('./containers/Search'));
const Channels = asyncComponent(() => import('./containers/Channels'));
const Channel = asyncComponent(() => import('./containers/Channel'));
const Feed = asyncComponent(() => import('./containers/Feed'));

import asyncComponent from './components/asyncComponent';
import Loader from './components/Loader';
import Player from './components/player/Player';

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = { apiLoaded: false };
  }

  signInUser = () => {
    const auth = getSignedInUser();

    auth.isSignedIn && this.props.signIn(auth);
  };

  async componentDidMount() {
    await loadAPI();

    await loadAuth();

    this.signInUser();

    this.setState({ apiLoaded: true }, this.props.listenAuthChange);
  }

  render() {
    const {
      state: { apiLoaded }
    } = this;

    return (
      <div className='layout' key='layout'>
        {apiLoaded
          ? [
              <Header key='header' />,
              <Switch key='routes'>
                <AuthRoute exact path='/' component={Playlists} />

                <AuthRoute path='/playlist/:playlistId' component={Playlist} />

                <Route exact path='/search' component={Search} />

                <Route path='/search/:query' component={Search} />

                <AuthRoute exact path='/subscriptions' component={Channels} />

                <Route exact path='/channel/:channelId' component={Channel} />

                <AuthRoute path='/feed' component={Feed} />

                <Route path='/login' component={Login} />
              </Switch>
            ]
          : null}

        <Player />

        <Loader isActive={!apiLoaded} />
      </div>
    );
  }
}

const mapStateToProps = ({ notifications: { message } }) => ({
  message
});

const mapDispatchToProps = (dispatch) => ({
  listenAuthChange: () =>
    listenAuth((data) => dispatch({ type: 'SIGN_IN', data })),

  signIn: (data) => dispatch({ type: 'SIGN_IN', data })
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Root)
);
