import React, { Component } from 'react';
import Header

class Screen extends Component {
    render() {
        return (
            <div class="layout">
                <Sprite />

                <Match>{({ path }) => <Header path={path} />}</Match>

                <main class="layout__content">
                    {apiIsReady && isSignedIn === true ? children : null}
                </main>

                <Player />

                <Prompt />

                {message ? <Notifications /> : null}
            </div>
        )
    }
}

export Screen