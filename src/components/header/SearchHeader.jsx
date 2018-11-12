import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import SearchForm from '../SearchForm';
import Icon from '../Icon';
import Button from '../Button';

class SearchHeader extends PureComponent {
  onFormSubmit = (query) => this.props.history.push(`/search/${query}`);

  render() {
    const {
      props: { setSearchMode, forMine },
      onFormSubmit
    } = this;

    return (
      <div className='layout__header-row'>
        <Link
          className='layout__back-button icon-button'
          to='/'
          aria-label='Close search'
          icon='back'
        >
          <Icon name='back' />
        </Link>

        <SearchForm onSubmit={onFormSubmit} />

        {/* <nav className="navigation">
                <div
                    className="navigation__button icon-button"
                    aria-label="Set search mode"
                >
                    <select
                        name="forMine"
                        value={forMine}
                        onChange={({ target: { options, selectedIndex } }) => {
                            const { value } = options[selectedIndex]

                            if (value !== forMine) {
                                route('/search')
                            }
                            setSearchMode(parseInt(value))
                        }}
                    >
                        <option key={0} value={0}>
                            All Videos
                        </option>
                        <option key={1} value={1}>
                            My Videos
                        </option>
                    </select>

                    <Icon className="icon" name='back' />
                </div>
            </nav> */}
      </div>
    );
  }
}

const mapStateToProps = ({ search: { forMine } }) => ({ forMine });

const mapDispatchToProps = (dispatch) => ({
  setSearchMode: (forMine) =>
    dispatch({
      type: 'SET_SEARCH_MODE',
      data: {
        forMine
      }
    })
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchHeader)
);
