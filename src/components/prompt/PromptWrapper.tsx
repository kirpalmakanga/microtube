import { FunctionComponent, MouseEvent } from 'react';
import { createPortal } from 'react-dom';

import Fade from '../animations/Fade';

import { stopPropagation } from '../../lib/helpers';

interface Props {
    isVisible: boolean,
    close: (event: MouseEvent) => void,
    chidren: Element[] | null
}

const container = document.querySelector('#prompt');

const Prompt: FunctionComponent<Props> = ({ children, close, isVisible }) => {
    return container ? createPortal(
        <Fade className="dialog__overlay" onClick={close} in={isVisible}>
            <div className="dialog shadow--2dp" onClick={stopPropagation()}>
                    <div className="dialog__content">{children}</div>
            </div>
        </Fade>,
        container
    ) : null;
};

export default Prompt;
