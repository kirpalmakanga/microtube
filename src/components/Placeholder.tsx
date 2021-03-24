import { FunctionComponent, ReactNode } from 'react';
import Icon from './Icon';

interface Props {
    icon: string;
    text: string;
    children?: ReactNode;
}

const Placeholder: FunctionComponent<Props> = ({
    icon,
    text,
    children = null
}) => (
    <div className="placeholder">
        <Icon name={icon} />
        <p>{text}</p>
        {children}
    </div>
);

export default Placeholder;
