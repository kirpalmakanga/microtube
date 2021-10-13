import { Component } from 'solid-js';

const CardContentInner: Component = (props) => (
    <div className="card__text">{props.children}</div>
);

export default CardContentInner;
