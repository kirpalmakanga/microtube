import { onCleanup } from 'solid-js';

export default function clickOutside(el: HTMLElement, accessor: () => () => void) {
    function onClick(e: Event) {
        if (!el.contains(e.target as Node)) accessor()?.();
    }

    document.body.addEventListener('click', onClick);

    onCleanup(() => document.body.removeEventListener('click', onClick));
}

declare module 'solid-js' {
    namespace JSX {
        interface Directives {
            clickOutside: () => void;
        }
    }
}
