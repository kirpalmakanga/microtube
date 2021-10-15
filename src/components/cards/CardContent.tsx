import { JSXElement, Component, splitProps } from 'solid-js';

interface Props {
    children: JSXElement;
    onClick: () => void;
}

const CardContent: Component<Props> = (props) => (
    <div className="card__content" onClick={props.onClick}>
        {props.children}
    </div>
);

export default CardContent;
