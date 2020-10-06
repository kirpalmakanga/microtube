import { createPortal } from 'react-dom';

import Fade from '../animations/Fade';

import { stopPropagation } from '../../lib/helpers';

const container = document.querySelector('#prompt');

const Prompt = ({ children, close = () => {}, isVisible }) => {
    return createPortal(
        <Fade className="dialog__overlay" onClick={close} in={isVisible}>
            <div className="dialog shadow--2dp" onClick={stopPropagation()}>
                {children ? (
                    <div className="dialog__content">{children}</div>
                ) : null}
            </div>
        </Fade>,
        container
    );
};

export default Prompt;
