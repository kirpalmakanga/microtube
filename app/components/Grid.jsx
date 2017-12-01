import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Waypoint from 'preact-waypoint'

import VisibilitySensor from './VisibilitySensor'

class Grid extends Component {
  constructor(props) {
    super(props)

    this.state = {
      items: [],
      pageToken: '',
      isLoading: false
    }
  }

  componentDidMount() {
    this.forceUpdate()
  }

  loadItems = () => {
    const { loadContent, onLoadingError = () => {} } = this.props
    const { pageToken, isLoading } = this.state


    if (isLoading || pageToken === null) {
      return
    }

    this.setState({ isLoading: true }, async () => {
      try {
        const { items, nextPageToken } = await loadContent(pageToken)

        console.log('nextPageToken', nextPageToken)

        this.setState((state) => ({
          items: [...state.items, ...items],
          pageToken: nextPageToken || null,
          isLoading: false
        }))
      } catch (e) {
        onLoadingError(e)
      }
    })
  }

  renderWaypoint() {
    return this.base ? (<Waypoint container={this.base} onEnter={this.loadItems} />) : null
  }

  render({ GridItem }, { items, isLoading }) {
    return (
      <div class='grid'>
        {items.map((data, i) => (
          <VisibilitySensor
            key={i}
            partialVisibility={true}
            scrollCheck={true}
            scrollThrottle={100}
            containment={this.base}
          >
          
            {({ isVisible, visibilityRect }) => (
              <div key={i} class={['grid__item', isVisible ? '': 'hidden'].join(' ')}>
                {isVisible ? (<GridItem {...data} />) : null}
              </div>
            )}

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
