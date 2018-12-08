import React, { PureComponent } from 'react';
import Transition from 'react-transition-group/Transition';

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,
    opacity: 0,
    transform: 'translateY(100%)'
};

const transitionStyles = {
    entering: { opacity: 0, transform: 'translateY(100%)' },
    entered: { opacity: 1, transform: 'translateY(0)' }
};

class FadeTranslateY extends PureComponent {
    render() {
        const {
            in: inProp,
            children,
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

export default FadeTranslateY;
