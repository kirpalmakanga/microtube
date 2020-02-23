import { PureComponent } from 'react';
import Transition from 'react-transition-group/Transition';

const duration = 150;

const defaultStyle = {
    transition: `transform ${duration}ms ease-in-out`,
    transform: 'translateY(100%)'
};

const transitionStyles = {
    entering: { transform: 'translateY(100%)' },
    entered: { transform: 'translateY(0)' }
};

class Fade extends PureComponent {
    render() {
        const { in: inProp, children, ...props } = this.props;
        return (
            <Transition
                in={inProp}
                mountOnEnter
                unmountOnExit
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
