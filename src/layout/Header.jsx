import { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

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
                    <Route path="/search/:query?" component={SearchHeader} />

                    <Route path="*" component={DefaultHeader} />
                </Switch>
            </header>
        );
    }
}

export default Header;
