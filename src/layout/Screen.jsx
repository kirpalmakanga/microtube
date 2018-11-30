import React, { PureComponent } from 'react';

import Prompt from '../components/Prompt';
import Notifications from '../components/Notifications';

class Screen extends PureComponent {
    render() {
        const { children } = this.props;

        return [
            <main className="layout__content" key="layout-content">
                {children}
            </main>,
            <Notifications key="notifications" />,
            <Prompt key="prompt" />
        ];
    }
}
export default Screen;
