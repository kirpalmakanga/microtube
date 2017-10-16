import { h, Component } from 'preact'
import { connect } from 'preact-redux'

class GoogleLogin extends Component {
  componentDidMount() {
    ((d, s, id, cb) => {
      const element = d.getElementsByTagName(s)[0]
      const fjs = element
      let js = element
      js = d.createElement(s)
      js.id = id
      js.src = '//apis.google.com/js/client:platform.js'
      fjs.parentNode.insertBefore(js, fjs)
      js.onload = cb
    })(document, 'script', 'google-login', () => {
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

  handleSuccess = (res) => {
    let { Zi, w3 } = res

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

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(GoogleLogin)
