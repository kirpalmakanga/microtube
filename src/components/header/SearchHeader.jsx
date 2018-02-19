import { h } from 'preact'
import { connect } from 'preact-redux'

import SearchForm from '../SearchForm'

const SearchHeader = ({ dispatch }) => {
  return (
    <div class='layout__header-row'>
      <button
        class='layout__back-button icon-button'
        onClick={() => window.history.back()}
        aria-label='Close search'
      >
        <span class='icon'>
          <svg><use xlinkHref='#icon-back'></use></svg>
        </span>
      </button>
      <SearchForm />
    </div>
  )
}

export default connect()(SearchHeader)
