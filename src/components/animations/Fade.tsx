import { FunctionComponent, MouseEvent, ReactNode } from 'react';
import Transition, {
    TransitionStatus,
    ENTERING,
    ENTERED,
    EXITING,
    EXITED,
    UNMOUNTED
} from 'react-transition-group/Transition';

interface Props {
    in: boolean;
    onClick?: (event: MouseEvent) => void;
    className?: string;
    duration?: number;
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
    children?: ReactNode;
}

const duration = 150;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0
};

const transitionStatuses = {
    [ENTERING]: {},
    [ENTERED]: { opacity: 1 },
    [EXITING]: {},
    [EXITED]: { opacity: 0 },
    [UNMOUNTED]: {}
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
