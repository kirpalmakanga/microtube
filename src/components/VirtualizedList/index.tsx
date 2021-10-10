import { JSX, JSXElement, splitProps } from 'solid-js';
import { createVirtualized } from './virtualize';
import { createScrollSync } from './scrollSync';
import Range from './range';

type ScrollEvent = UIEvent & {
    currentTarget: HTMLElement;
};

export interface VirtualizedListProps
    extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
    height: number;
    itemHeight: number;
    totalCount: number;
    buffer?: number;
    children: (index: number) => JSXElement;
    onScroll?: (e: ScrollEvent) => void;
}

export default function VirtualizedList(props: VirtualizedListProps) {
    const [, rest] = splitProps(props, [
        'height',
        'itemHeight',
        'totalCount',
        'buffer',
        'children',
        'style'
    ]);

    const [setScroll, scrollHandlers, scrollState] = createScrollSync();
    const virtualized = createVirtualized(
        () => props.height,
        () => props.itemHeight,
        () => props.totalCount,
        () => scrollState.top,
        () => props.buffer
    );

    const handleScroll = (e: ScrollEvent) => {
        if (props.onScroll) props.onScroll(e);

        scrollHandlers.vertical(e);
    };

    return (
        <div
            class="virtualized-list"
            onScroll={handleScroll}
            ref={setScroll.vertical}
            style={{
                ...(props.style as any),
                height: `${props.height}px`
            }}
            {...rest}
        >
            <ul
                style={{
                    'margin-top': `${virtualized.margins[0]}px`,
                    height: `${
                        virtualized.dimension + virtualized.margins[1]
                    }px`
                }}
            >
                <Range start={virtualized.start} count={virtualized.count}>
                    {(index) => <li>{props.children(index)}</li>}
                </Range>
            </ul>
        </div>
    );
}
