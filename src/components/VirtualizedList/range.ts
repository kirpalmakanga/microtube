import {
    createMemo,
    createRoot,
    getOwner,
    JSXElement,
    untrack
} from 'solid-js';

export function mapRange<T>(
    rangeStart: () => number,
    rangeCount: () => number,
    mapFn: (i: number) => T,
    options: { fallback?: () => any } = {}
): () => T[] {
    const ctx = getOwner()!;
    let prevItems: T[];
    let prevDisposers: (() => void)[] = [];
    let prevStart = 0;
    let prevEnd = 0;
    let prevCount = 0;

    return () => {
        const start = rangeStart();
        const count = rangeCount();

        if (count < 0) {
            return prevItems || null;
        }

        return untrack(() => {
            const end = start + count;
            const arrSize = count || options.fallback ? 1 : 0;
            const items = new Array<T>(arrSize);
            const disposers = new Array<() => void>(arrSize);
            let i: number;

            function mapper(disposer: () => void) {
                disposers[i] = disposer;
                return mapFn(i + start);
            }

            if (!prevCount) {
                if (count > 0) {
                    if (prevDisposers.length) {
                        prevDisposers[0]();
                    }
                    for (i = 0; i < count; i++) {
                        items[i] = createRoot(mapper, ctx);
                    }
                } else if (prevItems) {
                    return prevItems;
                }
            } else if (!count) {
                for (i = 0; i < prevCount; i++) {
                    prevDisposers[i]();
                    if (options.fallback) {
                        items[0] = createRoot((disposer) => {
                            disposers[0] = disposer;
                            return options.fallback!();
                        }, ctx);
                    }
                }
            } else if (start >= prevEnd || end <= prevStart) {
                for (i = 0; i < Math.min(count, prevCount); i++) {
                    prevDisposers[i]();
                    items[i] = createRoot(mapper, ctx);
                }
                for (; i < prevCount; i++) {
                    prevDisposers[i]();
                }
                for (; i < count; i++) {
                    items[i] = createRoot(mapper, ctx);
                }
            } else {
                const offset = prevStart - start;
                for (
                    i = Math.max(0, offset);
                    i < Math.min(count, prevCount + offset);
                    i++
                ) {
                    items[i] = prevItems[i - offset];
                    disposers[i] = prevDisposers[i - offset];
                }
                for (i = 0; i < start - prevStart; i++) {
                    prevDisposers[i]();
                }
                for (i = end - prevStart; i < prevEnd - prevStart; i++) {
                    prevDisposers[i]();
                }
                for (i = 0; i < prevStart - start; i++) {
                    items[i] = createRoot(mapper, ctx);
                }
                for (i = prevEnd - start; i < end - start; i++) {
                    items[i] = createRoot(mapper, ctx);
                }
            }

            prevDisposers = disposers;
            prevItems = items;
            prevStart = start;
            prevEnd = end;
            prevCount = count;

            return items;
        });
    };
}

export default function Range<U extends JSXElement>(props: {
    start: number;
    count: number;
    fallback?: JSXElement;
    children: (item: number) => U;
}) {
    const fallback = 'fallback' in props && { fallback: () => props.fallback };
    return createMemo(
        mapRange<U>(
            () => props.start,
            () => props.count,
            props.children,
            fallback ? fallback : undefined
        )
    );
}
