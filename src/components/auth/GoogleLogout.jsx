import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getAuthInstance } from 'api/youtube'

class GoogleLogout extends Component {
    signOut = () => {
        const auth2 = getAuthInstance()

        if (auth2 !== null) {
            auth2.signOut().then(this.props.onSuccess)
        }
    }

    render({ class: className, children }) {
        return (
            <button
                class={className}
                onClick={this.signOut}
                aria-label="Log out"
            >
                {children}
            </button>
        )
    }
}

export default GoogleLogout
