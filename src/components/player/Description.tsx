import { Component, createMemo } from 'solid-js';
import { wrapURLs } from '../../lib/helpers';

interface Props {
    text: string;
}

const Description: Component<Props> = (props) => {
    const text = createMemo(
        (text: string) => (text ? wrapURLs(text) : ''),
        props.text
    );

    return (
        <div
            class="fixed left-0 right-0 top-12 bottom-12 bg-primary-700 text-light-50 text-sm whitespace-prewrap p-4 a:hover:underline"
            innerHTML={text()}
        ></div>
    );
};

export default Description;
