// jshint esversion: 6, asi:true
// eslint-env es6

import React from 'react'
import { connect } from 'react-redux'

const Home = (props) => {
  return (
    <div className='columns is-multiline'>
      <div className='column is-one-quarter'>
        <div className='card is-fullwidth add-bottom'>
          <header className='card-header'>
            <p className='card-header-title'>En attente</p>
          </header>
          <div className='card-content'>
            <div className='content'>
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect()(Home)
