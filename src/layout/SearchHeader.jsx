import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import SearchForm from '../components/SearchForm';
import Icon from '../components/Icon';

import DropDown from '../components/DropDown';

class SearchHeader extends Component {
    render() {
        const {
            props: {
                isSignedIn,
                onSearchFormSubmit,
                query,
                setSearchMode,
                forMine
            }
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

                {isSignedIn ? (
                    <nav className="navigation">
                        <DropDown
                            currentValue={forMine}
                            options={[
                                { label: 'All videos', value: 0 },
                                { label: 'My Videos', value: 1 }
                            ]}
                            onSelect={(value) => setSearchMode(parseInt(value))}
                        />
                    </nav>
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = ({
    auth: { isSignedIn },
    search: { query, forMine }
}) => ({
    isSignedIn,
    query,
    forMine
});

const mapDispatchToProps = (dispatch) => ({
    setSearchMode: (forMine) =>
        dispatch({
            type: 'search/SET_TARGET',
            data: {
                forMine
            }
        })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchHeader);
