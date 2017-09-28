import { h } from 'preact'
import { connect } from 'preact-redux'

const SearchHeader = ({ player, dispatch }) => {
  return (
    <div class='layout__header-row'>
      <button
        class='layout__back-button icon-button'
        aria-label='Close queue'
        onClick={() => dispatch({ type: 'QUEUE_CLOSE' })}
      >
        <span class='icon'>
          <svg><use xlinkHref='#icon-back'></use></svg>
        </span>
      </button>

      <span class='layout-title'>{'Queue (' + player.queue.length + ' Items)'}</span>

      <nav class='navigation'>
        <button
          class='navigation__link icon-button'
          onClick={() => {
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
          }}
          aria-label='Add video'
        >
          <span class='icon'>
            <svg><use xlinkHref='#icon-add'></use></svg>
          </span>
        </button>

        <button
          class='navigation__link icon-button'
          onClick={() => {
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
          }}
          aria-label='Clear queue'
        >
          <span class='icon'>
            <svg><use xlinkHref='#icon-clear'></use></svg>
          </span>
        </button>
      </nav>
    </div>
  )
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(SearchHeader)
