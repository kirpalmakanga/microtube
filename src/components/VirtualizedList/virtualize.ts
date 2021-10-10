import { createComputed, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';

function tuplesEqual<T extends any[]>(a: [...T], b: [...T]) {
    return a.every((item, index) => item === b[index]);
}

function orDefault<T>(fn: (() => T | undefined) | undefined, fallback: T) {
    const value = fn ? fn() : undefined;
    return value !== undefined ? value : fallback;
}

export interface VirtualizeProps {
    size: number;
    itemSize: number;
    totalCount: number;
    position: number;
    buffer?: number;
}

export interface Virtualized {
    start: number;
    end: number;
    count: number;
    margins: [number, number];
    dimension: number;
}

export function createVirtualized(
    size: () => number,
    itemSize: () => number,
    totalCount: () => number,
    position: () => number,
    buffer?: () => number | undefined
): Virtualized {
    const [state, setState] = createStore({
        start: 0,
        end: 0,
        count: 0
    });

    const visibleRange = createMemo<[number, number]>(
        () => {
            const size_ = size();
            const itemSize_ = itemSize();
            if (size_ <= 0 || itemSize_ <= 0) {
                return [0, 0];
            }
            const start = Math.floor(position() / itemSize_);
            return [start, start + Math.max(Math.ceil(size_ / itemSize_), 1)];
        },
        undefined,
        { equals: tuplesEqual }
    );

    createComputed(() => {
        const buffer_ = orDefault(buffer, 1);
        const [visStart, visEnd] = visibleRange();
        const start = Math.max(visStart - buffer_, 0);
        const end = Math.min(visEnd + buffer_, totalCount());

        setState({
            start,
            end,
            count: end - start
        });
    });

    const margins = createMemo<[number, number]>(
        () => {
            const itemSize_ = itemSize();
            const { start, end } = state;
            return [start * itemSize_, (totalCount() - end) * itemSize_];
        },
        undefined,
        { equals: tuplesEqual }
    );

    const dimension = createMemo(() => state.count * itemSize(), undefined);

    return {
        get start() {
            return state.start;
        },
        get end() {
            return state.end;
        },
        get count() {
            return state.count;
        },
        get margins() {
            return margins();
        },
        get dimension() {
            return dimension();
        }
    };
}
