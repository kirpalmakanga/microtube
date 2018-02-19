import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import GoogleLogin from 'components/auth/GoogleLogin'
import { signIn } from 'actions/auth'

interface Props {
  signIn: Function
}

interface DispatchFromProps {
  signIn: Function
}

const Login = ({ signIn }: Props) => {
  return (
    <div class="log_in">
      <GoogleLogin className="button" onSuccess={signIn}>
        Log in
      </GoogleLogin>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  signIn: (params) => dispatch(signIn(params))
})

export default connect<void, DispatchFromProps, void>(
  () => ({}),
  mapDispatchToProps
)(Login)
