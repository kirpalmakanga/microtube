import { Component, createMemo } from 'solid-js';
import { wrapURLs } from '../../lib/helpers';

interface Props {
    text: string;
}

const Description: Component<Props> = (props) => {
    const text = createMemo((text) => (text ? wrapURLs(text) : ''), props.text);

    return <div className="PlayerDescription" innerHTML={text()}></div>;
};

export default Description;
