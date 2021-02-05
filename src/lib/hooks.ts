import { useRef, useState, useEffect, useCallback } from 'react';
import { GenericObject } from '../..';

const enableFullScreen = (element: HTMLDivElement) =>
    element.requestFullscreen();

const exitFullScreen = () => document.exitFullscreen();

const listenFullScreenChange = (
    element: HTMLDivElement,
    callback: (isFullscreen: boolean) => void
) =>
    document.addEventListener(
        'fullscreenchange',
        () => {
            const { ['fullscreenElement']: fullScreenElement } = document;
            const isFullscreen = fullScreenElement === element;

            callback(isFullscreen);
        },
        true
    );

export const useFullscreen = () => {
    const containerRef = useRef<HTMLDivElement>();
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = useCallback(() => {
        const { current: container } = containerRef;

        if (!isFullscreen && container) {
            enableFullScreen(container);
        } else {
            exitFullScreen();
        }

        setIsFullscreen(!isFullscreen);
    }, [isFullscreen]);

    useEffect(() => {
        const { current: container } = containerRef;

        if (container) {
            listenFullScreenChange(container, setIsFullscreen);
        }
    }, []);

    return [isFullscreen, containerRef, toggleFullscreen];
};

export const useKeyDown = (key: string, action: () => void) => {
    useEffect(() => {
        const onKeydown = ({ key: eventKey }: KeyboardEvent) =>
            eventKey === key && action();

        window.addEventListener('keydown', onKeydown);

        return () => window.removeEventListener('keydown', onKeydown);
    }, []);
};

export const useKeyPress = (key: string, action: () => void) => {
    useEffect(() => {
        const onKeyup = ({ key: eventKey }: KeyboardEvent) =>
            eventKey === key && action();

        window.addEventListener('keyup', onKeyup);

        return () => window.removeEventListener('keyup', onKeyup);
    }, []);
};

export const useMergedState = (
    initialState: GenericObject
): [GenericObject, (newState: GenericObject) => void] => {
    const [mergedState, setState] = useState<GenericObject>(initialState);
    const setMergedState = useCallback(
        (newState: GenericObject) =>
            setState((state: GenericObject) => ({ ...state, ...newState })),
        [mergedState]
    );

    return [mergedState, setMergedState];
};
