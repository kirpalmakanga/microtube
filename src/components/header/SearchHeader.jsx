import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import SearchForm from '../SearchForm';
import Icon from '../Icon';
import Button from '../Button';

class SearchHeader extends PureComponent {
  render() {
    const { setSearchMode, forMine, onFormSubmit } = this.props;

    return (
      <div class='layout__header-row'>
        <Button
          class='layout__back-button icon-button'
          onClick={() => window.history.back()}
          aria-label='Close search'
        >
          <Icon className='icon' />
        </Button>

        <SearchForm onSubmit={onFormSubmit} />
        {/* <nav class="navigation">
                <div
                    class="navigation__button icon-button"
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
//     query) => {
//     const to = '/search/' + query
//     route(to, true)
// }

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchHeader);
