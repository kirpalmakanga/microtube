import parseDuration from '../../lib/parseDuration'

import QueueItem from './QueueItem.jsx'

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

  dragStart = ({ currentTarget, dataTransfer }) => {
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData('text/html', currentTarget)

    this.setState({
      dragged: currentTarget,
      container: currentTarget.parentNode,
      placeholder: this.getPlaceholder()
    })
  }

  dragEnd = () => {
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

    console.log('drag end ?')

    this.props.dispatch({ type: 'QUEUE_SET', data })
  }

  dragOver = (e) => {
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
    const { dragEnd, dragStart, dragOver } = this
    const { player, handleClickPlay, dispatch } = this.props
    const { queue, showQueue, isBuffering } = player

    return (
        <div className={['queue shadow--2dp', showQueue ? 'queue--show' : ''].join(' ')} onDragOver={dragOver}>
            {queue.length ? queue.map(({ active, title }, index) => {
              return (
                <QueueItem
                  key={index}
                  id={index}
                  title={title}
                  isActive={active}
                  isBuffering={isBuffering}
                  onDragStart={dragStart}
                  onDragEnd={dragEnd}
                  onClick={() => {
                    if(!active) {
                      dispatch({
                        type: 'QUEUE_SET_ACTIVE_ITEM',
                        data: { index }
                      })
                    } else {
                      handleClickPlay()
                    }
                  }}
                  onClickRemove={(e) => {
                    e.stopPropagation()
                    dispatch({ type: 'QUEUE_REMOVE', data: index })
                  }}
                />
              )
            }, this) : null }
        </div>
    )
  }
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Queue)
