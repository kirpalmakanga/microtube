import {
    Component,
    onCleanup,
    onMount,
    JSXElement,
    createSignal
} from 'solid-js';
import { throttle } from '../lib/helpers';

export interface Size {
    height: number;
    width: number;
}

interface Props {
    children: (size: Size) => JSXElement;
}

/* TODO: fix recursion when setting state ??? */

const Autosizer: Component<Props> = (props) => {
    let resizeObserver: ResizeObserver;
    let _autoSizer: HTMLElement;
    let _parentNode: HTMLElement;

    const outerStyle = { display: 'none' };

    const [dimensions, setDimensions] = createSignal({
        width: 0,
        height: 0
    });

    const getRef = (el: HTMLElement) => (_autoSizer = el);

    onMount(() => {
        const { parentNode } = _autoSizer;

        if (
            parentNode?.ownerDocument?.defaultView &&
            parentNode instanceof
                parentNode.ownerDocument.defaultView.HTMLElement
        ) {
            _parentNode = parentNode;

            console.log('mount:autoSizer');

            resizeObserver = new ResizeObserver(
                throttle(() => {
                    console.log('onResize');
                    const { offsetWidth: width, offsetHeight: height } =
                        _parentNode;

                    // setDimensions({
                    //     width,
                    //     height
                    // });
                }, 200)
            );
            resizeObserver.observe(_parentNode);
        }
    });

    onCleanup(() => {
        if (resizeObserver) resizeObserver.disconnect();
    });

    return (
        <>
            <div ref={getRef} style={outerStyle}></div>
            {props.children(dimensions())}
        </>
    );
};

export default Autosizer;
