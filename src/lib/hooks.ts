import { createSignal, onCleanup, onMount } from 'solid-js';
import { KeyboardEventName } from '../../@types/alltypes';

export const useFullscreen = () => {
    let container: HTMLElement | null = null;

    const subscribeToFullscreen = (callback: Function) => {
        const eventName = 'fullscreenchange';
        const eventHandler = () => {
            const isFullscreen = document.fullscreenElement === container;

            callback(isFullscreen);
        };
        document.addEventListener(eventName, eventHandler, true);

        return () => document.removeEventListener(eventName, eventHandler);
    };

    const setFullscreenRef = (node: HTMLDivElement) => (container = node);

    const requestFullscreen = async () => {
        try {
            await container?.requestFullscreen();
        } catch (error) {}
    };

    const exitFullscreen = async () => {
        try {
            await document.exitFullscreen();
        } catch (error) {}
    };

    return {
        setFullscreenRef,
        subscribeToFullscreen,
        requestFullscreen,
        exitFullscreen
    };
};

export const useKeyboard = (
    key: string,
    action: () => void,
    event: KeyboardEventName,
    element?: HTMLElement
) => {
    const target = element || window;
    const listener = ({ key: eventKey }: KeyboardEvent) => {
        eventKey === key && action();
    };

    onMount(() => target.addEventListener(event, listener as EventListener));

    onCleanup(() =>
        target.removeEventListener(event, listener as EventListener)
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
            ([entry]) => {
                setIntersecting(entry.isIntersecting);
            },
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
