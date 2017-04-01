const { connect } = ReactRedux

const Channel = ({ auth }) => {
  return (
    <div>Channel</div>
  )
}


const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(Channel)
