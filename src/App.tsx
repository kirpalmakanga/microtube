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

interface Props {
    children: any
    isSignedIn: Boolean
    message: String
}

interface StateFromProps {
    isSignedIn: Boolean
    message: String
}

const App = ({ children, isSignedIn, message }: Props) => (
    <div class="layout">
        <Sprite />

        <Match>
            {({ path }) => {
                if (!isSignedIn && path !== '/login') {
                    route('/login', true)
                } else if (isSignedIn && path === '/login') {
                    route('/', true)
                }

                return <Header path={path} />
            }}
        </Match>

        <main class="layout__content">{isSignedIn ? children : null}</main>

        <Player />

        <Prompt />

        {message ? <Notifications /> : null}
    </div>
)

const mapStateToProps = ({
    auth: { isSignedIn },
    notifications: { message }
}) => ({
    isSignedIn,
    message
})

export default connect<StateFromProps, void, void>(mapStateToProps)(App)
