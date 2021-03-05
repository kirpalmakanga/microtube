import { io } from 'socket.io-client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { GenericObject } from '../../@types/alltypes';

export const useFullscreen = () => {
    const container = useRef<HTMLElement | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const setFullscreenRef = useCallback((node) => {
        const handler = () => {
            const { ['fullscreenElement']: fullScreenElement } = document;
            const isFullscreen = fullScreenElement === node;

            setIsFullscreen(isFullscreen);
        };

        if (container.current) {
            document.removeEventListener('fullscreenchange', handler);

            container.current = null;
        }

        if (node) {
            document.addEventListener('fullscreenchange', handler, true);
        }

        container.current = node;
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (!isFullscreen && container.current) {
            container.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }

        setIsFullscreen(!isFullscreen);
    }, [isFullscreen]);

    return { isFullscreen, setFullscreenRef, toggleFullscreen };
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
            client.current = io(serverUrl, { transports: ['websocket'] });
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
