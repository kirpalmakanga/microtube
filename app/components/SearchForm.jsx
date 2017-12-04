import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { searchVideos } from '../actions/youtube'

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
    const query = e.target.querySelector('#search').value
    e.preventDefault()

    this.props.dispatch(searchVideos({ query }))
  }

  render() {
    const { handleFocus, handleBlur, handleSubmit } = this

    return (
      <form class='search-form' onSubmit={handleSubmit}>
        <div class='textfield'>
          <label class='sr-only' for='search'>Search</label>
          <input
            autoFocus
            name='search'
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

export default connect()(SearchForm)
