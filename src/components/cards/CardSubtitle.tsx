import { Component } from 'solid-js';

interface Props {
    className?: string;
    children: Element | string;
}

const CardTitle: Component<Props> = (props) => (
    <h3
        className="card__subtitle"
        classList={{
            ...(props.className && { [props.className]: !!props.className })
        }}
    >
        {props.children}
    </h3>
);

export default CardTitle;
