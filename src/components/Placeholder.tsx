import { Component } from 'solid-js';
import Icon from './Icon';

interface Props {
    icon: string;
    text: string;
    children?: unknown;
}

const Placeholder: Component<Props> = ({ icon, text, children = null }) => (
    <div className="placeholder">
        <Icon name={icon} />
        <p>{text}</p>
        {children}
    </div>
);

export default Placeholder;
