import React, { PureComponent } from 'react';
import Transition from 'react-transition-group/Transition';

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0
};

const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 }
};

class Fade extends PureComponent {
    render() {
        const {
            in: inProp,
            children,
            duration = 200,
            mountOnEnter = true,
            unmountOnExit = true,
            ...props
        } = this.props;
        return (
            <Transition
                in={inProp}
                mountOnEnter={mountOnEnter}
                unmountOnExit={unmountOnExit}
                timeout={duration}
            >
                {(state) => (
                    <div
                        {...props}
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state]
                        }}
                    >
                        {children}
                    </div>
                )}
            </Transition>
        );
    }
}

export default Fade;
