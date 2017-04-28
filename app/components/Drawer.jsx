const { connect } = ReactRedux

const Drawer = ({ children, location, auth }) => {
  return (
    <div className='layout__drawer'>
        
    </div>
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(Drawer)
