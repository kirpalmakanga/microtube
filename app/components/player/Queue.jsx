import parseDuration from '../../lib/parseDuration'
import { setActiveQueueItem } from '../../actions/player'

const { connect } = ReactRedux

class Queue extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      data: props.player.queue
    }
  }

  componentWillReceiveProps(props){
   this.setState({ data: props.player.queue})
  }

  getPlaceholder() {
    let placeholder = this.placeholder
    if(!placeholder) {
      placeholder = document.createElement('div')
      placeholder.classList.add('queue__item', 'queue__item--placeholder')
    }
    return placeholder
  }

  dragStart({ currentTarget, dataTransfer }) {
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData('text/html', currentTarget)

    this.setState({
      dragged: currentTarget,
      container: currentTarget.parentNode,
      placeholder: this.getPlaceholder()
    })
  }

  dragEnd() {
    const { data, dragged, over, placeholder } = this.state
    const from = Number(dragged.dataset.id)
    let to = Number(over.dataset.id)

    dragged.classList.remove('queue__item--hidden')
    dragged.parentNode.removeChild(placeholder)

    if(from < to) {
      to--
    }

    if(this.state.nodePlacement == 'after') {
      to++
    }

    data.splice(to, 0, data.splice(from, 1)[0])

    this.props.dispatch({ type: 'QUEUE_SET', data })
  }

  dragOver(e) {
    const { target, pageY } = e
    const { dragged, container, placeholder } = this.state

    let relY
    let lastChildY

    e.preventDefault()

    dragged.classList.add('queue__item--hidden')

    if(target.classList.contains('queue__item--placeholder') || !target.getAttribute('draggable')) {
      return
    }

    this.setState({ over: target })

    relY = pageY - target.offsetTop
    lastChildY = pageY - container.lastChild.offsetTop + target.offsetHeight / 2

    if(relY <= lastChildY) {
      this.setState({ nodePlacement: 'after' })
      container.insertBefore(placeholder, target.nextElementSibling)
    } else {
      this.setState({ nodePlacement: 'before' })
      container.insertBefore(placeholder, target)
    }
  }

  render() {
    const { player, dispatch } = this.props
    return (
        <div className={['queue shadow--2dp', player.showQueue ? 'queue--show' : ''].join(' ')} onDragOver={this.dragOver.bind(this)}>
            {player.queue.length ? player.queue.map((video, index) => {
              const { title, active } = video
              return (
                <div
                  key={index}
                  className={['queue__item', active ? 'queue__item--active' : ''].join(' ')}
                  onClick={() => {
                    if(!active) {
                      dispatch({ type: 'RESET_TIME' })
                      dispatch(setActiveQueueItem({ queue: player.queue, index}))
                    } else if (player.isPlaying) {
                      player.youtube.pauseVideo()
                    } else {
                      player.youtube.playVideo()
                    }
                  }}
                  onDragEnd={this.dragEnd.bind(this)}
                  onDragStart={this.dragStart.bind(this)}
                  data-id={index}
                  data-title={title}
                  draggable
                >

                  <div className='queue__item-button icon-button'>
                    <span className={['icon', active && player.isBuffering ? 'rotating': ''].join(' ')}>
                      {active && player.isBuffering ? (
                        <svg><use xlinkHref='#icon-loading'></use></svg>
                      )
                      : active && player.isPlaying ? (
                        <svg><use xlinkHref='#icon-pause'></use></svg>
                      ) : (
                        <svg><use xlinkHref='#icon-play'></use></svg>
                      )}
                    </span>
                  </div>

                  <button
                    className='queue__item-button icon-button'
                    onClick={e => {
                      e.stopPropagation()
                      this.props.dispatch({ type: 'QUEUE_REMOVE', data: index })
                    }}
                  >
                    <span className='icon'>
                      <svg><use xlinkHref='#icon-close'></use></svg>
                    </span>
                  </button>
                </div>
              )
            }, this) : null }
        </div>
    )
  }
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Queue)
