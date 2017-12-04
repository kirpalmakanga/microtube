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
  //
  // componentDidMount() {
  //   this.forceUpdate()
  // }

  loadItems = () => {
    const { loadContent } = this.props
    const { pageToken, isLoading } = this.state


    if (isLoading || pageToken === null) {
      return
    }

    console.log('loading content')

    this.setState({ isLoading: true }, async () => {
      await loadContent()

      this.setState({ isLoading: false })
    })
  }

  componentDidMount() {
    this.forceUpdate()
  }

  renderWaypoint() {
    // return (<Waypoint container={this.grid} onEnter={this.loadItems} />)
    return this.grid ? (<Waypoint container={this.grid} onEnter={this.loadItems} />) : null
  }

  render({ items, ItemComponent }, { isLoading }) {
    return (
      <div class='grid' ref={(el) => { this.grid = el }}>
        {items.map((data, i) => (
          <VisibilitySensor
            key={i}
            partialVisibility={true}
            scrollCheck={true}
            scrollThrottle={100}
            containment={this.base}
            intervalCheck={false}
          >

            {({ isVisible }) => {
                return (
                  <div key={i} class={['grid__item', isVisible ? '': 'hidden'].join(' ')}>
                    {isVisible ? (<ItemComponent {...data} />) : null}
                  </div>
                )
            }}

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
