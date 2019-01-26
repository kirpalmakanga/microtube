import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import DefaultHeader from './DefaultHeader';
import SearchHeader from './SearchHeader';

class Header extends Component {
    state = { route: '' };

    onSearchFormSubmit = (query) =>
        this.props.history.replace(`/search/${query}`);

    componentWillMount() {
        const {
            location: { pathname: route },
            history
        } = this.props;

        this.setState({ route });

        this.unlisten = history.listen(({ pathname: route }) =>
            this.setState({ route })
        );
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        const {
            props: { onClick },
            state: { route },
            onSearchFormSubmit
        } = this;

        return (
            <header className="layout__header shadow--2dp" onClick={onClick}>
                {route.startsWith('/search') ? (
                    <SearchHeader onSearchFormSubmit={onSearchFormSubmit} />
                ) : (
                    <DefaultHeader route={route} />
                )}
            </header>
        );
    }
}

export default withRouter(Header);
