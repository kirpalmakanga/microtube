// jshint esversion: 6, asi: true
// eslint-env es6

import React from 'react'
import { connect } from 'react-redux'
import { getData } from '../../actions/database'

const SearchForm = ({ menu, dispatch }) => {

  function handleSearchFocus(e) {
    e.preventDefault()
    e.target.parentNode.classList.add('is-focused')
  }

  function handleSearchBlur(e) {
    e.preventDefault()
    e.target.parentNode.classList.remove('is-focused')
  }

  function handleSubmit(e) {
    const query = e.target.querySelector('#search').value
    e.preventDefault()

    dispatch(getData({
      type: 'SEARCH_VIDEOS',
      path: 'search/' + encodeURIComponent(query),
      query
    }))
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
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
        <label className='mdl-textfield__label' htmlFor='search'></label>
      </div>
    </form>
  )
}

export default connect()(SearchForm)
