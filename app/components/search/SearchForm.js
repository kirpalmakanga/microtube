// jshint esversion: 6, asi: true
// eslint-env es6



const { connect } = ReactRedux
import { searchVideos } from '../../actions/database'

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

    console.log('query', query)

    dispatch(searchVideos(auth.token, query))
  }

  return (
    <form className='search-form' onSubmit={handleSubmit}>
      <div className='mdl-textfield'>
        <input
          autoFocus
          className='mdl-textfield__input'
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
