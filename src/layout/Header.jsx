import { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { closeScreen } from '../actions/youtube';

import DefaultHeader from './DefaultHeader';
import SearchHeader from './SearchHeader';

class Header extends Component {
    render() {
        const {
            props: { closeScreen }
        } = this;

        return (
            <header
                className="layout__header shadow--2dp"
                onClick={closeScreen}
            >
                <Switch>
                    <Route path="/search/:query?" component={SearchHeader} />

                    <Route path="*" component={DefaultHeader} />
                </Switch>
            </header>
        );
    }
}

const mapDispatchToProps = {
    closeScreen
};

export default connect(() => {}, mapDispatchToProps)(Header);
