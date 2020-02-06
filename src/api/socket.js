import io from 'socket.io-client';
import { SOCKET_URL } from '../config/app';

let socket;

const getSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL);
    }

    return socket;
};

export default getSocket;

export const publish = (...params) => getSocket().emit(...params);

export const listen = (...params) => getSocket().on(...params);
