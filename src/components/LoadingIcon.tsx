import { Component } from 'solid-js';

interface Props {
    class?: string;
}

const LoadingIcon: Component<Props> = (props) => (
    <span class={`inline-block animate-spin ${props.class}`}>
        <svg class="fill-current w-full h-full" viewBox="0 0 32 32">
            <path d="M16 32c-4.274 0-8.292-1.664-11.314-4.686s-4.686-7.040-4.686-11.314c0-3.026 0.849-5.973 2.456-8.522 1.563-2.478 3.771-4.48 6.386-5.791l1.344 2.682c-2.126 1.065-3.922 2.693-5.192 4.708-1.305 2.069-1.994 4.462-1.994 6.922 0 7.168 5.832 13 13 13s13-5.832 13-13c0-2.459-0.69-4.853-1.994-6.922-1.271-2.015-3.066-3.643-5.192-4.708l1.344-2.682c2.615 1.31 4.824 3.313 6.386 5.791 1.607 2.549 2.456 5.495 2.456 8.522 0 4.274-1.664 8.292-4.686 11.314s-7.040 4.686-11.314 4.686z"></path>
        </svg>
    </span>
);

export default LoadingIcon;
