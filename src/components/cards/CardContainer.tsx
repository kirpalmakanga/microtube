import { FunctionComponent } from 'react';

interface Props {
    onClick?: () => void;
    onContextMenu?: () => void;
}

const CardContainer: FunctionComponent<Props> = ({ children, ...props }) => (
    <div className="card" {...props}>
        {children}
    </div>
);

export default CardContainer;
