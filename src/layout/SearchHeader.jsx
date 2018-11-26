import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import SearchForm from '../components/SearchForm';
import Icon from '../components/Icon';
import Button from '../components/Button';

class SearchHeader extends Component {
    render() {
        const {
            props: { onSearchFormSubmit, query, setSearchMode, forMine }
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

                <SearchForm query={query} onSubmit={onSearchFormSubmit} />

                <nav className="navigation">
                    <div
                        className="navigation__button icon-button"
                        aria-label="Set search mode"
                    >
                        <select
                            name="forMine"
                            value={forMine}
                            onChange={({
                                target: { options, selectedIndex }
                            }) => {
                                const { value } = options[selectedIndex];

                                setSearchMode(parseInt(value));
                            }}
                        >
                            <option key={0} value={0}>
                                All Videos
                            </option>
                            <option key={1} value={1}>
                                My Videos
                            </option>
                        </select>
                    </div>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = ({ search: { query, forMine } }) => ({
    query,
    forMine
});

const mapDispatchToProps = (dispatch) => ({
    setSearchMode: (forMine) =>
        dispatch({
            type: 'SET_SEARCH_MODE',
            data: {
                forMine
            }
        })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchHeader);
