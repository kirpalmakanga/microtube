import { FunctionComponent, MouseEvent } from 'react';
import Transition, {
    TransitionStatus,
    ENTERING,
    ENTERED,
    EXITING,
    EXITED,
    UNMOUNTED
} from 'react-transition-group/Transition';

const duration = 150;

interface Props {
    in: boolean;
    onClick?: (event: MouseEvent) => void;
    className?: string;
    duration?: number;
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
    children?: any;
}

const defaultStyle = {
    transition: `transform ${duration}ms ease-in-out`,
    transform: 'translateY(100%)'
};

const transitionStatuses = {
    [ENTERING]: { transform: 'translateY(100%)' },
    [ENTERED]: { transform: 'translateY(0)' },
    [EXITING]: { transform: 'translateY(0)' },
    [EXITED]: { transform: 'translateY(0)' },
    [UNMOUNTED]: { transform: 'translateY(0)' }
};

const Fade: FunctionComponent<Props> = ({
    duration = 150,
    mountOnEnter = true,
    unmountOnExit = true,
    in: inProp,
    children,
    ...props
}) => {
    return (
        <Transition
            in={inProp}
            mountOnEnter={mountOnEnter}
            unmountOnExit={unmountOnExit}
            timeout={duration}
        >
            {(state: TransitionStatus) => (
                <div
                    {...props}
                    style={{
                        ...defaultStyle,
                        ...transitionStatuses[state]
                    }}
                >
                    {children}
                </div>
            )}
        </Transition>
    );
};

export default Fade;
