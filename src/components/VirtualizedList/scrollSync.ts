import { createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';

type ScrollEvent = UIEvent & {
    currentTarget: HTMLElement;
};

type ScrollHandlers = {
    (evt: ScrollEvent): void;
    vertical: (evt: ScrollEvent) => void;
    horizontal: (evt: ScrollEvent) => void;
};

type ScrollSetters = {
    (el: HTMLElement): void;
    vertical: (el: HTMLElement) => void;
    horizontal: (el: HTMLElement) => void;
};

interface ScrollPosition {
    top: number;
    left: number;
}

interface ScrollInfo extends ScrollPosition {
    isScrolling: boolean;
    dx: number;
    dy: number;
}

interface ScrollState extends ScrollInfo {
    source?: HTMLElement;
}

type Direction = 'vertical' | 'horizontal';

export function createScrollSync(): [
    ScrollSetters,
    ScrollHandlers,
    ScrollInfo
] {
    const [scrollState, setScrollState] = createStore<ScrollState>({
        source: undefined,
        top: 0,
        left: 0,
        dx: 0,
        dy: 0,
        get isScrolling() {
            return !!this.source;
        }
    });

    let scrollEndTimeout: any;
    function handleScroll(
        next: Partial<ScrollPosition> & { source: HTMLElement }
    ) {
        clearTimeout(scrollEndTimeout);
        scrollEndTimeout = setTimeout(
            () =>
                setScrollState({
                    source: undefined,
                    dx: 0,
                    dy: 0
                }),
            20
        );
        if (!scrollState.source || next.source === scrollState.source) {
            const dx =
                next.left !== undefined ? next.left - scrollState.left : 0;
            const dy = next.top !== undefined ? next.top - scrollState.top : 0;
            if (dx || dy) {
                setScrollState({
                    ...next,
                    dx,
                    dy
                });
            }
        }
    }

    const createScrollSetter = (direction?: Direction) => (el: HTMLElement) =>
        createEffect(() => {
            if (scrollState.source && scrollState.source !== el) {
                if (direction !== 'horizontal') {
                    el.scrollTop = scrollState.top;
                }
                if (direction !== 'vertical') {
                    el.scrollLeft = scrollState.left;
                }
            }
        });

    const scrollHandlers: ScrollHandlers = (evt) =>
        handleScroll({
            source: evt.currentTarget,
            left: evt.currentTarget.scrollLeft,
            top: evt.currentTarget.scrollTop
        });
    scrollHandlers.vertical = (evt) =>
        handleScroll({
            source: evt.currentTarget,
            top: evt.currentTarget.scrollTop
        });
    scrollHandlers.horizontal = (evt) =>
        handleScroll({
            source: evt.currentTarget,
            left: evt.currentTarget.scrollLeft
        });

    const scrollSetters = createScrollSetter() as ScrollSetters;
    scrollSetters.vertical = createScrollSetter('vertical');
    scrollSetters.horizontal = createScrollSetter('horizontal');

    return [scrollSetters, scrollHandlers, scrollState];
}
