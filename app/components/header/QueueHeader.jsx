const { connect } = ReactRedux

const SearchHeader = ({ player, dispatch }) => {
  return (
    <div className='layout__header-row'>
      <button
        className='layout__back-button icon-button'
        onClick={() => dispatch({ type: 'QUEUE_CLOSE' })}
      >
        <span className='icon'>
          <svg><use xlinkHref='#icon-back'></use></svg>
        </span>
      </button>

      <span className='layout-title'>{'Queue (' + player.queue.length + ' Items)'}</span>

      <nav className='navigation'>
        <button className='navigation__link icon-button' onClick={() => {
          dispatch({
            type: 'PROMPT',
            data: {
              promptText: 'Ajouter une vidéo',
              confirmText: 'Ajouter',
              form: true,
              callback: () => {
                dispatch({ type: 'PROMPT_CLOSE' })
              }
            }
          })
        }}>
          <span className='icon'>
            <svg><use xlinkHref='#icon-add'></use></svg>
          </span>
        </button>

        <button className='navigation__link icon-button' onClick={() => {
          dispatch({
            type: 'PROMPT',
            data: {
              promptText: 'Vider la file d\'attente ?',
              confirmText: 'Vider',
              callback: () => {
                dispatch({ type: 'QUEUE_CLEAR' })
                dispatch({ type: 'PROMPT_CLOSE' })
              }
            }
          })
        }}>
          <span className='icon'>
            <svg><use xlinkHref='#icon-clear'></use></svg>
          </span>
        </button>
      </nav>
    </div>
  )
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(SearchHeader)
