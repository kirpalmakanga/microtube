import { Component } from 'solid-js';

const CardButtons: Component = (props) => (
    <div className="card__buttons">{props.children}</div>
);

export default CardButtons;
