import { Component } from 'solid-js';
import Icon from './Icon';
import LoadingIcon from './LoadingIcon';

const Loader: Component = () => (
    <div class="absolute inset-0 z-1 flex items-center justify-center bg-primary-900">
        <LoadingIcon class="text-light-50 h-12 w-12 " />
    </div>
);

export default Loader;
