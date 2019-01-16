import React, { PureComponent } from 'react';

import Prompt from '../components/Prompt';
import Notifications from '../components/Notifications';

class Screen extends PureComponent {
    render() {
        const { children } = this.props;

        return (
            <>
                <main className="layout__content">{children}</main>
                <Notifications />
                <Prompt />
            </>
        );
    }
}
export default Screen;
