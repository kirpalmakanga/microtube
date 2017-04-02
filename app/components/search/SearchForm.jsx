import { searchVideos } from '../../actions/database'
const { connect } = ReactRedux

const SearchForm = ({ menu, auth, dispatch }) => {

  function handleFocus(e) {
    e.preventDefault()
    e.target.parentNode.classList.add('is-focused')
  }

  function handleBlur(e) {
    e.preventDefault()
    e.target.parentNode.classList.remove('is-focused')
  }

  function handleSubmit(e) {
    const query = e.target.querySelector('#search').value
    e.preventDefault()

    dispatch(searchVideos(auth.token, query))
  }

  return (
    <form className='search-form' onSubmit={handleSubmit}>
      <div className='textfield'>
        <input
          autoFocus
          className='textfield__input'
          id='search'
          type='text'
          placeholder='Search...'
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </form>
  )
}
const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(SearchForm)
