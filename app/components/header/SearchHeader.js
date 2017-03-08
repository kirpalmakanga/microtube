import SearchForm from '../search/SearchForm.js'

const { connect } = ReactRedux

const SearchHeader = ({ dispatch }) => {
  return (
    <div className='layout__header-row'>
      <button
        className='layout__back-button icon-button'
        onClick={() => dispatch({ type: 'SEARCH_CLOSE' })}
      >
        <span className='icon'>
          <svg><use xlinkHref='#icon-back'></use></svg>
        </span>
      </button>
      <SearchForm />
    </div>
  )
}

export default connect()(SearchHeader)
