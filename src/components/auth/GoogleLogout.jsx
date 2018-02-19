import { h, Component } from 'preact'
import { connect } from 'preact-redux'

class GoogleLogout extends Component {
  componentDidMount() {
    ((d, s, cb) => {
      const clientUrl = '//apis.google.com/js/client.js'
      const element = d.getElementsByTagName(s)[0]
      const fjs = element
      let js = element

      if(!d.querySelector(`script[src="${clientUrl}"]`)) {
        js = d.createElement(s)
        js.src = clientUrl
        fjs.parentNode.insertBefore(js, fjs)
        js.onload = cb
      }

    })(document, 'script', () => window.gapi.load('auth2'))
  }

  signOut = () => {
    const auth2 = window.gapi.auth2.getAuthInstance()
    if (auth2 !== null) {
      auth2.signOut().then(this.props.onSuccess)
    }
  }

  render({ className, children }) {
    return (
      <button class={className} onClick={this.signOut} aria-label='Log out'>
        {children}
      </button>
    )
  }
}

export default GoogleLogout
