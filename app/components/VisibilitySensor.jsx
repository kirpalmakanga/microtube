import { h, Component } from 'preact'
import { span } from 'preact-dom'

function throttle (callback, limit) {
    var wait = false
    return () => {
        if (!wait) {
            wait = true
            setTimeout(() => {
                callback()
                wait = false
            }, limit)
        }
    }
}

function debounce(func, wait) {
  let timeout
  return () => {
    const context = this
    const args = arguments
    const later = () => {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default class VisibilitySensor extends Component {
  static defaultProps = {
    onChange: () => {},
    active: true,
    partialVisibility: false,
    minTopValue: 0,
    scrollCheck: false,
    scrollDelay: 250,
    scrollThrottle: -1,
    resizeCheck: false,
    resizeDelay: 250,
    resizeThrottle: -1,
    intervalCheck: true,
    intervalDelay: 100,
    delayedCall: false,
    offset: {},
    containment: null,
    children: span
  }

  getInitialState() {
    return {
      isVisible: null,
      visibilityRect: {}
    }
  }

  componentDidMount() {
    this.node = this.base
    if (this.props.active) {
      this.startWatching()
    }
  }

  componentWillUnmount () {
    this.stopWatching()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active && !this.props.active) {
      this.setState(this.getInitialState())
      this.startWatching()
    } else if (!nextProps.active) {
      this.stopWatching()
    }
  }

  getContainer () {
    return this.props.containment || window
  }

  addEventListener(target, event, delay, throttle) {
    if (!this.debounceCheck) {
      this.debounceCheck = {}
    }

    let timeout
    let func

    const later = () => {
      timeout = null
      this.check()
    }

    if (throttle > -1) {
      func = () => {
        if (!timeout) {
          timeout = setTimeout(later, throttle || 0)
        }
      }
    } else {
      func = () => {
        clearTimeout(timeout)
        timeout = setTimeout(later, delay || 0)
      }
    }

    const info = {
      target,
      func,
      getLastTimeout: () => timeout,
    }

    target.addEventListener(event, info.func)
    this.debounceCheck[event] = info
  }

  startWatching() {
    if (this.debounceCheck || this.interval) {
      return
    }

    if (this.props.intervalCheck) {
      this.interval = setInterval(this.check, this.props.intervalDelay)
    }

    if (this.props.scrollCheck) {
      this.addEventListener(
        this.getContainer(),
        'scroll',
        this.props.scrollDelay,
        this.props.scrollThrottle
      )
    }

    if (this.props.resizeCheck) {
      this.addEventListener(
        window,
        'resize',
        this.props.resizeDelay,
        this.props.resizeThrottle
      )
    }

    // if dont need delayed call, check on load ( before the first interval fires )
    !this.props.delayedCall && this.check()
  }

  stopWatching() {
    if (this.debounceCheck) {
      // clean up event listeners and their debounce callers
      for (var debounceEvent in this.debounceCheck) {
        if (this.debounceCheck.hasOwnProperty(debounceEvent)) {
          var debounceInfo = this.debounceCheck[debounceEvent]

          clearTimeout(debounceInfo.getLastTimeout())
          debounceInfo.target.removeEventListener(
            debounceEvent, debounceInfo.func
          )

          this.debounceCheck[debounceEvent] = null
        }
      }
    }
    this.debounceCheck = null

    if (this.interval) { this.interval = clearInterval(this.interval) }
  }

  /**
   * Check if the element is within the visible viewport
   */
  check() {
    const el = this.node
    let rect
    let containmentRect
    // if the component has rendered to null, dont update visibility
    if (!el) {
      return this.state
    }

    rect = el.getBoundingClientRect()

    if (this.props.containment) {
      const { top, left, bottom, right } = this.props.containment.getBoundingClientRect()

      containmentRect = { top, left, bottom, right }
    } else {
      containmentRect = {
        top: 0,
        left: 0,
        bottom: window.innerHeight || document.documentElement.clientHeight,
        right: window.innerWidth || document.documentElement.clientWidth
      }
    }

    // Check if visibility is wanted via offset?
    const offset = this.props.offset || {}
    const hasValidOffset = typeof offset === 'object'
    if (hasValidOffset) {
      containmentRect.top += offset.top || 0
      containmentRect.left += offset.left || 0
      containmentRect.bottom -= offset.bottom || 0
      containmentRect.right -= offset.right || 0
    }

    const visibilityRect = {
      top: rect.top >= containmentRect.top,
      left: rect.left >= containmentRect.left,
      bottom: rect.bottom <= containmentRect.bottom,
      right: rect.right <= containmentRect.right
    }

    let isVisible = (
      visibilityRect.top &&
      visibilityRect.left &&
      visibilityRect.bottom &&
      visibilityRect.right
    )

    // check for partial visibility
    if (this.props.partialVisibility) {
      var partialVisible =
          rect.top <= containmentRect.bottom && rect.bottom >= containmentRect.top &&
          rect.left <= containmentRect.right && rect.right >= containmentRect.left

      // account for partial visibility on a single edge
      if (typeof this.props.partialVisibility === 'string') {
        partialVisible = visibilityRect[this.props.partialVisibility]
      }

      // if we have minimum top visibility set by props, lets check, if it meets the passed value
      // so if for instance element is at least 200px in viewport, then show it.
      isVisible = this.props.minTopValue
        ? partialVisible && rect.top <= (containmentRect.bottom - this.props.minTopValue)
        : partialVisible
    }

    var state = this.state
    // notify the parent when the value changes
    if (this.state.isVisible !== isVisible) {
      state = { isVisible, visibilityRect }
      this.setState(state)
      if (this.props.onChange) this.props.onChange(isVisible, visibilityRect)
    }

    return state
  }

  render({ children }, { isVisible, visibilityRect }) {
    return (
      <div>
       {children[0] instanceof Function ? children[0]({ isVisible, visibilityRect }) : children}
      </div>
    )
  }
}
