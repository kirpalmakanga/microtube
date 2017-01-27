import SearchForm from '../search/SearchForm.js'

const { connect } = ReactRedux

const SearchHeader = ({ dispatch }) => {
  return (
    <div className='mdl-layout__header-row'>
      <button
        className='mdl-layout__drawer-button'
        onClick={() => dispatch({ type: 'SEARCH_CLOSE' })}
      >
          <svg><use xlinkHref='#icon-back'></use></svg>
      </button>
      <SearchForm />
    </div>
  )
}

export default connect()(SearchHeader)
