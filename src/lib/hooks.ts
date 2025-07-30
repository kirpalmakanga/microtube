import { createSignal, onCleanup, onMount } from 'solid-js';

export const useFullscreen = () => {
    const eventName = 'fullscreenchange';

    let container: HTMLElement | null = null;

    const [isFullscreen, setIsFullscreen] = createSignal<boolean>(false);

    function onFullscreenChange() {
        setIsFullscreen(document.fullscreenElement === container);
    }

    onMount(() => {
        document.addEventListener(eventName, onFullscreenChange, true);
    });

    onCleanup(() => {
        document.removeEventListener(eventName, onFullscreenChange);
    });

    return {
        isFullscreen,
        fullscreenRef(node: HTMLElement) {
            container = node;
        },
        enterFullscreen() {
            if (container) {
                container.requestFullscreen();
            } else {
                throw new Error('useFullscreen: Invalid target element.');
            }
        },
        exitFullscreen() {
            document.exitFullscreen();
        }
    };
};

export const useKeyboard = (
    action: (() => void) | ((e: KeyboardEvent) => void),
    event: KeyboardEventName,
    element?: HTMLElement
) => {
    const target = element || window;

    onMount(() => target.addEventListener(event, action as EventListener));

    onCleanup(() => target.removeEventListener(event, action as EventListener));
};

export const useKey = (
    event: KeyboardEventName,
    key: string,
    action: () => void,
    element?: HTMLElement
) => {
    useKeyboard(
        ({ key: eventKey }: KeyboardEvent) => {
            eventKey === key && action();
        },
        event,
        element
    );
};

export const useOnScreen = (
    rootMargin: string = '0px'
): [(el: HTMLElement) => void, () => boolean] => {
    const [isIntersecting, setIntersecting] = createSignal(false);
    let observer: IntersectionObserver;
    let ref: HTMLElement;

    const setRef = (el: HTMLElement) => (ref = el);

    onMount(() => {
        observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting),
            {
                rootMargin
            }
        );

        if (ref && observer) observer.observe(ref);
    });

    onCleanup(() => {
        if (ref && observer) observer.unobserve(ref);
    });

    return [setRef, isIntersecting];
};
