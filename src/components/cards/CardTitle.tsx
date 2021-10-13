import { Component } from 'solid-js';

const CardTitle: Component = (props) => (
    <h2 className="card__title">{props.children}</h2>
);

export default CardTitle;
