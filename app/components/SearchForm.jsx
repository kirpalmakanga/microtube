import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { searchVideos } from '../actions/database'

class SearchForm extends Component {

  handleFocus = (e) => {
    e.preventDefault()
    e.target.parentNode.classList.add('is-focused')
  }

  handleBlur = (e) => {
    e.preventDefault()
    e.target.parentNode.classList.remove('is-focused')
  }

  handleSubmit = (e) => {
    const { auth, dispatch } = this.props
    const query = e.target.querySelector('#search').value
    e.preventDefault()

    dispatch(searchVideos(auth.token, query))
  }

  render() {
    const { handleFocus, handleBlur, handleSubmit } = this

    return (
      <form class='search-form' onSubmit={handleSubmit}>
        <div class='textfield'>
          <input
            autoFocus
            class='textfield__input'
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
}
const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(SearchForm)
