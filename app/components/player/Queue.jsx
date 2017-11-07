import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { throttle } from 'lodash'

import parseDuration from '../../lib/parseDuration'

import QueueHeader from './QueueHeader'
import QueueItem from './QueueItem'

class Queue extends Component {
  constructor(props) {
    super(props)

    this.state = {
      queue: props.player.queue,
      over: null,
      dragged: null,
      placeholder: null
    }
  }

  componentWillReceiveProps = ({ player }) => this.setState({ queue: player.queue })

  shouldComponentUpdate = (nextProps, { over }) => {
    return over === null
  }

  getPlaceholder = () => {
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
      placeholder: this.getPlaceholder()
    })
  }

  dragOver = throttle((e) => {
    const { target, pageY } = e
    const { dragged, placeholder } = this.state

    e.preventDefault()

    dragged.classList.add('queue__item--hidden')

    if(target.classList.contains('queue__item--placeholder') || !target.getAttribute('draggable')) {
      return
    }

    this.setState({ over: target })

    const { container } = this
    const relY = pageY - target.offsetTop
    const lastChildY = pageY - container.lastChild.offsetTop + target.offsetHeight / 2

    if(relY <= lastChildY) {
      this.setState({ nodePlacement: 'after' })
      container.insertBefore(placeholder, target.nextElementSibling)
    } else {
      this.setState({ nodePlacement: 'before' })
      container.insertBefore(placeholder, target)
    }
  }, 200)

  dragEnd = (e) => {
    const { container } = this
    const { queue, dragged, over, placeholder } = this.state
    const from = Number(dragged.dataset.index)
    let to = Number(over.dataset.index)

    e.preventDefault()

    dragged.classList.remove('queue__item--hidden')
    container.removeChild(placeholder)

    if(from < to) {
      to--
    }

    if(this.state.nodePlacement === 'after') {
      to++
    }

    queue.splice(to, 0, queue.splice(from, 1)[0])

    this.props.dispatch({ type: 'QUEUE_SET', data: queue })
    this.setState({ over: null })
  }

  makeOnClickItem = (index, currentIndex) => () => {
    if(index !== currentIndex) {
      this.props.dispatch({ type: 'QUEUE_SET_ACTIVE_ITEM', data: { index } })
    } else {
      this.props.togglePlay()
    }
  }

  makeRemoveItem = (index) => (e) => {
    e.stopPropagation()
    this.props.dispatch({ type: 'QUEUE_REMOVE', data: index })
  }

  render({ player, isPlaying, isBuffering }, { queue }) {
    const { dragEnd, dragStart, dragOver, makeOnClickItem, makeRemoveItem } = this
    const { showQueue, currentIndex } = player

    return (
        <div className={['queue shadow--2dp', showQueue ? 'queue--show' : ''].join(' ')}>
          <QueueHeader />
          <div className='queue__items' onDragOver={dragOver} ref={el => this.container = el}>
            {queue.length ? queue.map(({ title, active }, index) => (
              <QueueItem
                key={index}
                index={index}
                title={title}
                isActive={active}
                isBuffering={isBuffering}
                isPlaying={isPlaying}
                onDragStart={dragStart}
                onDragEnd={dragEnd}
                onClick={makeOnClickItem(index, currentIndex)}
                onClickRemove={makeRemoveItem(index)}
              />
            ), this) : null}
          </div>
        </div>
    )
  }
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Queue)
