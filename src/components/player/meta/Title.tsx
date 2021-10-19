import { Component, onCleanup, onMount } from 'solid-js';

interface Props {
    children: string;
}

const Title: Component<Props> = (props) => {
    const previousTitle = '';

    onMount(() => {
        const title = document.head.querySelector('title');

        if (title) {
            console.log({ title: title.textContent });
            title.textContent = props.children;
        }
    });

    onCleanup(() => {});

    return null;
};

export default Title;
