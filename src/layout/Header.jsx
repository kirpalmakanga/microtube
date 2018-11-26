import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import DefaultHeader from './DefaultHeader';
import SearchHeader from './SearchHeader';

class Header extends Component {
    state = { location: { pathname: '' } };

    onSearchFormSubmit = (query) => this.props.history.push(`/search/${query}`);

    componentWillMount() {
        const { location = { pathname: '' }, history } = this.props;

        this.setState({ location });

        this.unlisten = history.listen((location) =>
            this.setState({ location })
        );
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        const {
            state: {
                location: { pathname: route }
            },
            onSearchFormSubmit
        } = this;

        return (
            <header key="header" className="layout__header shadow--2dp">
                {route.startsWith('/search') ? (
                    <SearchHeader onSearchFormSubmit={onSearchFormSubmit} />
                ) : (
                    <DefaultHeader location={this.state.location} />
                )}
            </header>
        );
    }
}

export default withRouter(Header);
