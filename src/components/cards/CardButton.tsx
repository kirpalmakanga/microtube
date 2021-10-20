import { Component } from 'solid-js';
import Button, { ButtonProps } from '../Button';

const CardButton: Component<ButtonProps> = (props) => (
    <Button className="card__button icon-button" {...props} />
);

export default CardButton;
