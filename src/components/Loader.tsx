import { Component } from 'solid-js';
import Icon from './Icon';

const Loader: Component = () => (
    <div class="loader">
        <div class="loader__background" />
        <Icon name="loading" />
    </div>
);

export default Loader;
