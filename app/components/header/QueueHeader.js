const { connect } = ReactRedux

const SearchHeader = ({ player, dispatch }) => {
  return (
    <div className='mdl-layout__header-row'>
      <button
        className='mdl-layout__drawer-button'
        onClick={() => dispatch({ type: 'QUEUE_CLOSE' })}
      >
          <svg><use xlinkHref='#icon-back'></use></svg>
      </button>
      <span className='mdl-layout-title'>{'Queue (' + player.queue.length + ' Items)'}</span>
      <div className='mdl-layout-spacer'></div>
      <nav className='mdl-navigation'>
        <button className='mdl-navigation__link' onClick={() => {
          dispatch({
            type: 'PROMPT_ADD_VIDEO',
            callback: () => dispatch({ type: 'PROMPT_CLOSE' })
          })
        }}>
          <svg><use xlinkHref='#icon-add'></use></svg>
        </button>

        <button className='mdl-navigation__link' onClick={() => {
          dispatch({
            type: 'PROMPT_CLEAR_QUEUE',
            callback: () => {
              dispatch({
                type: 'QUEUE_CLEAR',
                currentVideo: player.video
              })
              dispatch({ type: 'PROMPT_CLOSE' })
            }
          })
        }}>
          <svg><use xlinkHref='#icon-clear'></use></svg>
        </button>
      </nav>
    </div>
  )
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(SearchHeader)
