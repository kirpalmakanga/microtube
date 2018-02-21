import 'styles/app.scss'

import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import { route } from 'preact-router'
import Match from 'preact-router/match'

import Sprite from 'components/Sprite'
import Header from 'components/header/HeaderContainer'
import Player from 'containers/Player'
import Notifications from 'components/Notifications'
import Prompt from 'components/Prompt'
import GoogleLogin from 'components/auth/GoogleLogin'

import { loadAPI, listenAuth } from 'api/youtube'

interface Props {
    children: any
    isSignedIn: Boolean
    message: String
    authenticateUser: Function
    signIn: Function
}

interface StateFromProps {
    isSignedIn: Boolean
    message: String
}

interface DispatchFromProps {
    authenticateUser: Function
    signIn: Function
}

class App extends Component<Props, any> {
    constructor(props: Props) {
        super(props)
    }

    async componentDidMount() {
        await loadAPI()

        this.props.authenticateUser()
    }

    render({ children, isSignedIn, message, signIn }: Props) {
        return (
            <div class="layout">
                <Sprite />

                <Match>
                    {({ path }) => {
                        return <Header path={path} />
                    }}
                </Match>

                <main class="layout__content">
                    {isSignedIn === true ? (
                        children
                    ) : isSignedIn === false ? (
                        <div class="log_in">
                            <GoogleLogin class="button" onSuccess={signIn}>
                                Log in
                            </GoogleLogin>
                        </div>
                    ) : null}
                </main>

                <Player />

                <Prompt />

                {message ? <Notifications /> : null}
            </div>
        )
    }
}

const mapStateToProps = ({
    auth: { isSignedIn },
    notifications: { message }
}) => ({
    isSignedIn,
    message
})

const mapDispatchToProps = (dispatch) => ({
    authenticateUser: () =>
        listenAuth((data) => dispatch({ type: 'SIGN_IN', data })),

    signIn: (data) => dispatch({ type: 'SIGN_IN', data })
})

export default connect<StateFromProps, DispatchFromProps, void>(
    mapStateToProps,
    mapDispatchToProps
)(App)
