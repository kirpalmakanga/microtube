import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import GoogleLogin from 'components/auth/GoogleLogin'

const Login = ({ dispatch }) => {
  return (
      <div class='log_in'>
        <GoogleLogin
          className='button'
          onSuccess={(data) => dispatch({ type: 'SIGN_IN', data })}
        >Log in</GoogleLogin>
      </div>
  )
}

export default connect()(Login)
