import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import DefaultHeader from './DefaultHeader';
import SearchHeader from './SearchHeader';

class Header extends Component {
    render() {
        const {
            props: { onClick }
        } = this;

        return (
            <header className="layout__header shadow--2dp" onClick={onClick}>
                <Switch>
                    <Route
                        path="/search/:query?"
                        component={(props) => <SearchHeader {...props} />}
                    />
                    <Route
                        path="*"
                        component={(props) => <DefaultHeader {...props} />}
                    />
                </Switch>
            </header>
        );
    }
}

export default Header;
