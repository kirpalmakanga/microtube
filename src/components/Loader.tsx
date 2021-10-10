import { Component } from 'solid-js';
import Icon from './Icon';

const Loader: Component = () => (
    <div className="loader">
        <div className="loader__background" />
        <Icon name="loading" />
    </div>
);

export default Loader;
