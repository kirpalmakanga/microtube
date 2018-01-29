import { h, Component } from 'preact'
import { connect } from 'preact-redux'

class GoogleLogin extends Component {
  componentDidMount() {
    ((d, s, cb) => {
      const clientUrl = '//apis.google.com/js/client.js'
      const element = d.getElementsByTagName(s)[0]
      const fjs = element
      let js = element

      if(!d.querySelector(`script[src="${clientUrl}"]`)) {
        js = d.createElement(s)
        js.src = '//apis.google.com/js/client.js'
        fjs.parentNode.insertBefore(js, fjs)
        js.onload = cb
      } else {
        cb()
      }

    })(document, 'script', () => {
      const params = {
        clientId: '440745412600-snpeajuh0l9tqfrt356mec6j3mdn8eoo.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/youtube'
      }
      window.gapi.load('auth2', () => {
        if (!window.gapi.auth2.getAuthInstance()) {
          window.gapi.auth2.init(params).then(
            (res) => {
              if (res.isSignedIn.get()) {
                this.handleSuccess(res.currentUser.get())
              }
            },
            (err) => console.error(err)
          )
        }
      })
    })
  }

  handleSuccess = async (res) => {
    let { Zi, w3 } = res

    console.log(res)
    
    this.props.onSuccess({
      isSignedIn: true,
      token: Zi.access_token,
      user: {
        picture: w3.Paa,
        userName: w3.ig || w3.ofa
      }
    })
  }

  signIn = () => {
    const auth2 = window.gapi.auth2.getAuthInstance()
    auth2.signIn().then(
      this.handleSuccess,
      (err) => console.error(err)
    )
  }

  render({ className, children }) {
    return (
      <button class={className} onClick={this.signIn} aria-label='Log in'>
        {children}
      </button>
    )
  }
}

export default GoogleLogin
