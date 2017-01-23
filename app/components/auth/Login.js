// jshint esversion: 6, asi: true
// eslint-env es6

import React from 'react'

import connect from 'react-redux/lib/components/connect'

const Login = ({ auth }) => {
  return (
    <div>
      <div>Avatar</div>
      <div>Name</div>
    </div>
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(Login)
