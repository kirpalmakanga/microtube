import {
    useRef,
    useState,
    useEffect,
    useCallback,
    MutableRefObject
} from 'react';
import { GenericObject } from '../../@types/alltypes';

export const useFullscreen = () => {
    const container = useRef<HTMLElement | null>(null);
    const subscribeToFullscreen = (callback: Function) => {
        const eventName = 'fullscreenchange';
        const eventHandler = () => {
            const isFullscreen =
                document.fullscreenElement === container.current;

            callback(isFullscreen);
        };
        document.addEventListener(eventName, eventHandler, true);

        return () => document.removeEventListener(eventName, eventHandler);
    };

    const setFullscreenRef = (node: HTMLDivElement) =>
        (container.current = node);

    const requestFullscreen = async () => {
        try {
            await container.current?.requestFullscreen();
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

export const useKeyDown = (key: string, action: () => void) => {
    useEffect(() => {
        const listener = ({ key: eventKey }: KeyboardEvent) =>
            eventKey === key && action();

        window.addEventListener('keydown', listener);

        return () => window.removeEventListener('keydown', listener);
    }, []);
};

export const useKeyPress = (key: string, action: () => void) => {
    useEffect(() => {
        const listener = ({ key: eventKey }: KeyboardEvent) =>
            eventKey === key && action();

        window.addEventListener('keyup', listener);

        return () => window.removeEventListener('keyup', listener);
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

export const useUpdateEffect = (callback: () => void, dependencies: any) => {
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) isFirstRun.current = false;
        else callback();
    }, dependencies);
};

export const useOnScreen = (
    ref: MutableRefObject<Element | null>,
    rootMargin: string = '0px'
): boolean => {
    const [isIntersecting, setIntersecting] = useState<boolean>(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIntersecting(entry.isIntersecting);
            },
            {
                rootMargin
            }
        );

        if (ref.current) observer.observe(ref.current);

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return isIntersecting;
};
