import { Component } from 'solid-js';

interface Props {
    children: string;
}

const CardTitle: Component<Props> = (props) => (
    <h3 className="card__subtitle">{props.children}</h3>
);

export default CardTitle;
