import { h } from 'preact'
import { connect } from 'preact-redux'
import { route } from 'preact-router'

import SearchForm from '../SearchForm'

const SearchHeader = ({ dispatch }) => {
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
        </div>
    )
}

export default connect()(SearchHeader)
