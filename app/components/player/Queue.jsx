import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { throttle } from 'lodash'

import parseDuration from '../../lib/parseDuration'

import QueueItem from './QueueItem'

class Queue extends Component {
  constructor(props) {
    super(props)

    this.state = {
      queue: props.player.queue,
      over: null
    }
  }

  componentWillReceiveProps = ({ player: { queue } }) => this.setState({ queue })

  shouldComponentUpdate = (_, { over }) => (over === null)

  getPlaceholder = () => {
    let placeholder = this.placeholder
    if(!placeholder) {
      placeholder = document.createElement('div')
      placeholder.classList.add('queue__item', 'queue__item--placeholder')
    }
    return placeholder
  }

  insertPlaceholder = (pageY) => {
    const {
      container, placeholder,
      state: { over }
    } = this
    const relY = pageY - over.offsetTop
    const lastChildY = pageY - container.lastChild.offsetTop + over.offsetHeight / 2

    if(relY <= lastChildY) {
      this.nodePlacement = 'after'
      container.insertBefore(placeholder, over.nextElementSibling)
    } else {
      this.nodePlacement = 'before'
      container.insertBefore(placeholder, over)
    }
  }

  dragStart = ({ currentTarget: dragged, dataTransfer }) => {
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData('text/html', dragged)

    dragged.classList.add('queue__item--hidden')

    this.dragged = dragged
    this.placeholder = this.getPlaceholder()
  }

  dragOver = throttle((e) => {
    const { target: over, pageY } = e    

    e.preventDefault()

    if(over.classList.contains('queue__item--placeholder') || !over.getAttribute('draggable')) {
      return
    }
    
    this.setState({ over }, () => this.insertPlaceholder(pageY))
  }, 100)

  dragEnd = (e) => {
    const { container, dragged, placeholder, nodePlacement } = this
    const { queue, over } = this.state
    const from = Number(dragged.dataset.index)
    let to = Number(over.dataset.index)

    e.preventDefault()

    if(from < to) {
      to--
    }

    if(nodePlacement === 'after') {
      to++
    }

    dragged.classList.remove('queue__item--hidden')
    container.removeChild(placeholder)

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
          <div className='queue__items' onDragOver={dragOver} ref={(el) => this.container = el}>
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
                draggable
              />
            ), this) : null}
          </div>
        </div>
    )
  }
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Queue)
