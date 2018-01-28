import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Waypoint from 'preact-waypoint'

import VisibilitySensor from './VisibilitySensor'

class Grid extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  loadItems = () => {
    const { loadContent } = this.props
    const { isLoading } = this.state

    if (isLoading) {
      return
    }

    this.setState({ isLoading: true }, async () => {
      await loadContent()

      this.setState({ isLoading: false })
    })
  }

  componentDidMount() {
    this.forceUpdate()
  }

  renderWaypoint() {
    return this.grid ? (<Waypoint container={this.grid} onEnter={this.loadItems} />) : null
  }

  render({ items = [], ItemComponent }, { isLoading }) {
    return (
      <div class='grid' ref={(el) => { this.grid = el }}>
        {this.grid && items.map((data, i) => (
          <VisibilitySensor
            key={i}
            className={(isVisible) => ['grid__item', isVisible ? '': 'hidden'].join(' ')}
            partialVisibility={true}
            scrollCheck={true}
            scrollThrottle={100}
            containment={this.grid}
            intervalCheck={true}
          >
            {({ isVisible }) => isVisible ? (<ItemComponent {...data} />) : null}
          </VisibilitySensor>
        ))}

        <div class={['grid__loading', isLoading ? 'is-active': ''].join(' ')}>
          {this.renderWaypoint()}
          <svg class='rotating'><use xlinkHref='#icon-loading'></use></svg>
        </div>
      </div>
    )
  }
}

export default Grid
