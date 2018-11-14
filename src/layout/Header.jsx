import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import {
    signIn,
    signOut,
    getPlaylistTitle,
    getChannelTitle
} from '../api/youtube';

import Icon from '../components/Icon';
import Button from '../components/Button';

import SearchHeader from '../components/header/SearchHeader';

const initialState = {
    title: 'MicroTube'
};

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillReceiveProps = async ({ location: { pathname } }) => {
        let title = 'MicroTube';

        if (pathname.includes('/subscriptions')) {
            title = 'Subscriptions';
        }

        if (pathname.includes('/channel')) {
            title = await getChannelTitle(pathname.slice(1).split('/')[1]);
        }

        if (pathname.includes('/playlist')) {
            title = await getPlaylistTitle(pathname.slice(1).split('/')[1]);
        }

        this.setState({ title });
    };

    openSearchForm = () => {
        const { dispatch } = this.props;

        dispatch({ type: 'SCREEN_CLOSE' });

        dispatch({ type: 'QUEUE_CLOSE' });

        dispatch({ type: 'SEARCH_OPEN' });
    };

    handleAuth = async () => {
        const {
            auth: { isSignedIn },
            dispatch
        } = this.props;

        if (!isSignedIn) {
            const data = await signIn();

            return dispatch({ type: 'SIGN_IN', data });
        }

        await signOut();

        dispatch({ type: 'SIGN_OUT' });
    };

    render() {
        const {
            props: {
                auth: {
                    isSignedIn,
                    user: { picture }
                },
                location: { pathname }
            },
            state: { title }
        } = this;

        return [
            <Helmet key="headers" title={title} />,
            <header key="header" className="layout__header shadow--2dp">
                {pathname.includes('/search') ? (
                    <SearchHeader />
                ) : (
                    <div className="layout__header-row">
                        {pathname !== '/' ? (
                            <Link
                                className="layout__back-button icon-button"
                                to="/"
                                aria-label="Go to homepage"
                            >
                                <Icon name="back" />
                            </Link>
                        ) : null}

                        <span className="layout-title">{title}</span>

                        <nav className="navigation">
                            <Link
                                className="navigation__link icon-button"
                                aria-label="Open search"
                                to="/search"
                            >
                                <Icon name="search" />
                            </Link>

                            <Link
                                className="navigation__link icon-button"
                                to="/subscriptions"
                                aria-label="Open subscriptions"
                            >
                                <Icon name="subscriptions" />
                            </Link>

                            <Button
                                className="navigation__link icon-button"
                                onClick={this.handleAuth}
                                title={isSignedIn ? 'Log out' : 'Log in'}
                                icon="account"
                            >
                                {picture ? (
                                    <img src={picture} alt="avatar" />
                                ) : null}
                            </Button>
                        </nav>
                    </div>
                )}
            </header>
        ];
    }
}

const mapStateToProps = ({ auth }) => ({
    auth
});

export default withRouter(connect(mapStateToProps)(Header));
