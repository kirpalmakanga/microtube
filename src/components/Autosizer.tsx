import { Component, onCleanup, onMount, JSXElement } from 'solid-js';
import { createStore } from 'solid-js/store';

export type Size = {
    height: number;
    width: number;
};

interface Props {
    children: (size: Size) => JSXElement;
}

const Autosizer: Component<Props> = ({ children }) => {
    let resizeObserver: ResizeObserver;
    let _autoSizer: HTMLElement;
    let _parentNode: HTMLElement;

    const [dimensions, setDimensions] = createStore({
        width: 0,
        height: 0
    });

    const getAutoSizer = (el: HTMLElement) => (_autoSizer = el);

    const onResize = () => {
        const { offsetWidth: width, offsetHeight: height } = _parentNode;

        setDimensions({
            width,
            height
        });
    };

    onMount(() => {
        const { parentNode } = _autoSizer;

        if (
            parentNode?.ownerDocument?.defaultView &&
            parentNode instanceof
                parentNode.ownerDocument.defaultView.HTMLElement
        ) {
            _parentNode = parentNode;

            onResize();

            resizeObserver = new ResizeObserver(onResize);

            resizeObserver.observe(_autoSizer);
        }
    });

    onCleanup(() => {
        if (resizeObserver) resizeObserver.unobserve(_autoSizer);
    });

    return <div ref={getAutoSizer}>{children(dimensions)}</div>;
};

export default Autosizer;
