import { h } from 'preact'
import { connect } from 'preact-redux'
import { route } from 'preact-router'
import { Link } from 'preact-router/match'

import SearchForm from '../SearchForm'

const SearchHeader = ({ setSearchMode, forMine }) => {
    return (
        <div class="layout__header-row">
            <button
                class="layout__back-button icon-button"
                onClick={() => window.history.back()}
                aria-label="Close search"
            >
                <span class="icon">
                    <svg>
                        <use xlinkHref="#icon-back" />
                    </svg>
                </span>
            </button>
            <SearchForm
                onSubmit={(query) => {
                    const to = '/search/' + query
                    route(to, true)
                }}
            />
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

                    <span class="icon">
                        <svg>
                            <use xlinkHref="#icon-chevron-down" />
                        </svg>
                    </span>
                </div>
            </nav> */}
        </div>
    )
}

const mapStateToProps = ({ search: { forMine } }) => ({ forMine })

const mapDispatchToProps = (dispatch) => ({
    setSearchMode: (forMine) =>
        dispatch({
            type: 'SET_SEARCH_MODE',
            data: {
                forMine
            }
        })
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchHeader)
