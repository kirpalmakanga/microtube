import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import SearchForm from '../components/SearchForm';
import Icon from '../components/Icon';

import DropDown from '../components/DropDown';

import { setSearchTarget } from '../actions/youtube.js';

class SearchHeader extends Component {
    handleFormSubmit = (query) => {
        const { history } = this.props;

        history.replace(`/search/${query}`);
    };

    handleDropDownSelect = (value) => {
        const { setSearchTarget } = this.props;

        setSearchTarget(parseInt(value));
    };

    render() {
        const {
            props: { isSignedIn, forMine, query },
            handleFormSubmit,
            handleDropDownSelect
        } = this;

        return (
            <div className="layout__header-row">
                <Link
                    className="layout__back-button icon-button"
                    to="/"
                    aria-label="Close search"
                    icon="back"
                >
                    <Icon name="back" />
                </Link>

                <SearchForm query={query} onSubmit={handleFormSubmit} />

                {isSignedIn ? (
                    <nav className="navigation">
                        <DropDown
                            currentValue={forMine}
                            options={[
                                { label: 'All videos', value: 0 },
                                { label: 'My Videos', value: 1 }
                            ]}
                            onSelect={handleDropDownSelect}
                        />
                    </nav>
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = (
    { auth: { isSignedIn }, search: { forMine } },
    {
        match: {
            params: { query }
        }
    }
) => ({
    isSignedIn,
    forMine,
    query
});

const mapDispatchToProps = {
    setSearchTarget
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchHeader);
