import { h, Component } from 'preact'

interface Props {
  children?: any
  onEnter: Function
  onLeave?: Function
  container?: any
}

class Waypoint extends Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }

  private container: any
  private boundScroller: Function
  private prev: Boolean

  componentDidMount() {
    this.container = this.props.container || window

    // bind before adding as a listener so we can remove later
    this.boundScroller = this.handleScroll
    this.container.addEventListener('scroll', this.boundScroller)

    // possibly call onEnter when mounting if waypoint is visible
    this.handleScroll(null)
  }

  componentWillUnmount() {
    this.container.removeEventListener('scroll', this.boundScroller)
  }

  isInside = () => {
    const waypointTop = this.base.getBoundingClientRect().top

    // grab this.props.container's height
    const contextHeight =
      this.container !== window
        ? this.container.offsetHeight
        : window.innerHeight

    // grab this.props.container's scrollTop (window is always 0)
    const contextScrollTop =
      this.container !== window ? this.container.getBoundingClientRect().top : 0

    // if waypoint is in between container's top and bottom edges
    // return true, false if above top or below bottom
    return (
      contextScrollTop <= waypointTop &&
      waypointTop <= contextScrollTop + contextHeight
    )
  }

  handleScroll = (event) => {
    const current = this.isInside()
    const prev = this.prev || false
    this.prev = current

    // don't fire if previous call was the same
    if (prev === current) {
      return
    }

    // default callbacks
    const { onEnter = () => {}, onLeave = () => {} } = this.props

    if (current) onEnter(event)
    if (prev) onLeave(event)
  }

  render({ children }: Props) {
    return children.length ? children[0] : h('span', null)
  }
}

export default Waypoint
