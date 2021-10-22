import { Component, createEffect, onCleanup, onMount } from 'solid-js';

interface Props {
    children: string;
}

const Title: Component<Props> = (props) => {
    createEffect((previousTitle) => {
        const { children: title } = props;

        if (title === previousTitle) return previousTitle;

        let titleTag = document.head.querySelector('title');

        if (!titleTag) {
            titleTag = document.createElement('title');

            document.head.appendChild(titleTag);
        }

        titleTag.textContent = title;

        return title;
    }, props.children);

    return null;
};

export default Title;
