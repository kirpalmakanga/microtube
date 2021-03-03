import { io } from 'socket.io-client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { GenericObject } from '../../@types/alltypes';

export const useFullscreen = () => {
    const container = useRef<HTMLElement | null>(null);
    // const [isFullscreen, setIsFullscreen] = useState(false);

    const subscribeToFullscreen = (callback: Function) => {
        const eventName = 'fullscreenchange';
        const eventHandler = () => {
            const isFullscreen =
                document.fullscreenElement === container.current;

            // setIsFullscreen(isFullscreen);

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
        // setIsFullscreen(true);
    };

    const exitFullscreen = async () => {
        try {
            await document.exitFullscreen();
        } catch (error) {}
        // setIsFullscreen(false);
    };

    // useEffect(() => {
    //     const unsubscribe = subscribeToFullscreen(() => {
    //         const { ['fullscreenElement']: fullscreenElement } = document;
    //         const isFullscreen = fullscreenElement === container.current;

    //         setIsFullscreen(isFullscreen);
    //     });

    //     return () => {
    //         unsubscribe();
    //         container.current = null;
    //     };
    // }, []);

    return {
        // isFullscreen,
        setFullscreenRef,
        subscribeToFullscreen,
        requestFullscreen,
        exitFullscreen
    };
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

export const useUpdateEffect = (callback: () => void, dependencies: any) => {
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;

            return;
        }

        callback();
    }, dependencies);
};

export const useSocket = (serverUrl: string) => {
    const client = useRef<any | null>(null);

    const getSocket = () => {
        if (!client.current) {
            console.log({ serverUrl });
            client.current = io(serverUrl);
        }
        return client.current;
    };

    return {
        subscribe: (eventKey: string, callback: (response: any) => void) => {
            getSocket().on(eventKey, callback);
        },
        emit: (eventKey: string, payload: any) => {
            getSocket().emit(eventKey, payload);
        }
    };
};
