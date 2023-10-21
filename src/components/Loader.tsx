import { Component } from 'solid-js';
import Icon from './Icon';

const Loader: Component = () => (
    <div class="absolute inset-0 z-1 flex items-center justify-center bg-primary-900">
        <Icon class="text-light-50 h-12 w-12 animate-spin" name="loading" />
    </div>
);

export default Loader;
