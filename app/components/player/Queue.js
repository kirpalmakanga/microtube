// jshint esversion: 6, asi: true
// eslint-env es6

import parseDuration from '../../lib/parseDuration'
import { Throttle } from 'react-throttle'

const { connect } = ReactRedux

const placeholder = document.createElement('div')
placeholder.classList.add('queue__item', 'queue__item--placeholder')


class Queue extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: props.player.queue }
  }

  componentWillReceiveProps(props){
   this.setState({ data: props.player.queue})
  }

  dragStart({ currentTarget, dataTransfer }) {
    this.setState({ dragged: currentTarget })
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData('text/html', currentTarget)
  }

  dragEnd() {
    const { data, dragged, over } = this.state
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

    this.state.dragged.classList.add('queue__item--hidden')

    if(target.classList.contains('queue__item--placeholder')) {
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
    const { player, dispatch } = this.props
    return (
      <Throttle time='200' handler='onDragOver'>
        <div className={['queue mdl-shadow--2dp', player.showQueue ? 'queue--show': ''].join(' ')} onDragOver={this.dragOver.bind(this)}>
        	{player.queue.length ? player.queue.map((item, i) => {
            const isCurrentVideo = (player.video.videoId === item.videoId)
          	return (
            	<div
                key={i}
                className={['queue__item', isCurrentVideo ? 'queue__item--active' : ''].join(' ')}
                onDragEnd={this.dragEnd.bind(this)}
                onDragStart={this.dragStart.bind(this)}
                data-id={i}
                data-title={item.title}
                data-duration={parseDuration(item.duration)}
                draggable
                >
                {!isCurrentVideo ? (
                  <button
                    className='queue__item-button'
                    onClick={() => {
                      dispatch({ type: 'CLEAR_WATCHERS' })

                      dispatch({
                        type: 'PLAY',
                        data: item,
                        skip: true
                      })
                    }}
                  >
                    <svg><use xlinkHref='#icon-play'></use></svg>
                  </button>
                ) : null}

                <button
                  className='queue__item-button'
                  onClick={() => dispatch({
                    type: 'QUEUE_REMOVE',
                    index: i
                  })}
                >
                  <svg><use xlinkHref='#icon-close'></use></svg>
                </button>
              </div>
            )
       	 	}, this) : null }
        </div>
      </Throttle>
    )
  }
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Queue)
