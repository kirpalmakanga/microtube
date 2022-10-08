import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config/app';

let socket: Socket | null = null;

const getSocket = () => {
    if (!socket) {
        socket = io(API_URL, { transports: ['websocket'] });
    }

    return socket;
};

export const subscribe = (
    eventKey: string,
    callback: (response: any) => void
) => {
    getSocket().on(eventKey, callback);
};

export const emit = (eventKey: string, payload: any) => {
    getSocket().emit(eventKey, payload);
};
