const { connect } = ReactRedux

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
