// jshint esversion: 6, asi: true
// eslint-env es6

import QueueItem from './QueueItem'

const { connect } = ReactRedux

const placeholder = document.createElement('div')
placeholder.classList.add('draggable-list__item', 'draggable-list__item--placeholder')


class QueueItems extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: props.data }
  }

  dragStart({ currentTarget, dataTransfer }) {
    this.setState({ dragged: currentTarget })
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData('text/html', currentTarget)
  }

  dragEnd() {
    const data = this.state.data
    const from = Number(this.state.dragged.dataset.id)
    let to = Number(this.state.over.dataset.id)

    this.state.dragged.classList.remove('draggable-list__item--hidden')
    this.state.dragged.parentNode.removeChild(placeholder)

    if(from < to) {
      to--
    }

    if(this.nodePlacement == 'after') {
      to++
    }

    data.splice(to, 0, data.splice(from, 1)[0])

    this.props.dispatch({
      type: 'QUEUE_SET',
      newQueue: data
    })
  }

  dragOver(e) {
    const { target, clientY } = e

    const parent = target.parentNode

    let relY
    let height

    e.preventDefault()

    this.state.dragged.classList.add('draggable-list__item--hidden')

    if(target.classList.contains('draggable-list__item--placeholder') || target.getAttribute('draggable') !== 'true') {
      return
    }

    this.setState({ over: target })

    relY = clientY - target.offsetTop
    height = target.offsetHeight / 2

    if(relY > height) {
      this.setState({ nodePlacement: 'after' })
      parent.insertBefore(placeholder, target.nextElementSibling)
    }
    else if(relY < height) {
      this.setState({ nodePlacement: 'before' })
      parent.insertBefore(placeholder, target)
    }
  }

  render() {
    return (
      <div className='draggable-list' onDragOver={this.dragOver.bind(this)}>
      	{this.state.data.map((item, i) => {
        	return (
          	<div className='draggable-list__item' data-id={i} key={i} onDragEnd={this.dragEnd.bind(this)} onDragStart={this.dragStart.bind(this)} draggable>
         			<QueueItem index={i} data={item} />
            </div>
          )
     	 	}, this)}
      </div>
    )
  }
}

export default connect()(QueueItems)
