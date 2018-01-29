import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import GoogleLogin from 'components/auth/GoogleLogin'
import { signIn } from 'actions/auth'


const Login = ({ dispatch }) => {
  return (
      <div class='log_in'>
        <GoogleLogin
          className='button'
          onSuccess={async (data) => await dispatch(signIn(data))}
        >Log in</GoogleLogin>
      </div>
  )
}

export default connect()(Login)
