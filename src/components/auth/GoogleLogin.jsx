import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getAuthInstance } from 'api/youtube'

class GoogleLogin extends Component {
    signIn = () => {
        const auth2 = getAuthInstance()

        auth2.signIn().then(
            (res) => {
                const { Zi, w3: { Paa: picture = '', ig = '', ofa = '' } } = res
                const userName = ig || ofa

                this.props.onSuccess({
                    user: { picture, userName },
                    isSignedIn: true
                })
            },
            (err) => console.error(err)
        )
    }

    render({ class: className, children }) {
        return (
            <button class={className} onClick={this.signIn} aria-label="Log in">
                {children}
            </button>
        )
    }
}

export default GoogleLogin
