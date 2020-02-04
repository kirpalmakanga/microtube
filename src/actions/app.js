import io from 'socket.io-client';
import { SOCKET_URL } from '../config/app';
import { uuidv4 } from '../lib/helpers';

import { loadAPI, getAuthInstance as loadAuth } from '../api/youtube';

import { queueVideos, queuePlaylist, getUserData } from './youtube';

let socket = io(SOCKET_URL);

export const initializeApp = () => async (dispatch) => {
    await loadAPI();

    await loadAuth();

    await dispatch(getUserData());

    dispatch(
        connectToSocket({
            onConnect: () => {
                dispatch(setDevice());

                dispatch(subscribeToSync());
            }
        })
    );

    if (!window.queueVideos) {
        window.queueVideos = (ids = []) => dispatch(queueVideos(ids));
    }

    if (!window.queuePlaylist) {
        window.queuePlaylist = (id) => dispatch(queuePlaylist(id));
    }
};

export const connectToSocket = ({
    onConnect = () => {},
    onDisconnect = () => {}
} = {}) => (_, getState) => {
    const {
        auth: {
            user: { id: userId }
        }
    } = getState();

    socket = io(SOCKET_URL);

    socket.on('connect', () => {
        console.log('Connected to socket');

        socket.emit('room', userId);

        onConnect();
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from socket');

        onDisconnect();
    });
};

export const setDevice = () => (dispatch, getState) => {
    let {
        app: { deviceId }
    } = getState();

    let deviceName = navigator.appCodeName;

    if (!deviceId) {
        deviceId = uuidv4();

        dispatch({
            type: 'app/SET_DEVICE_ID',
            data: { deviceId }
        });
    }

    socket.emit('device:add', { deviceId, deviceName });
};

export const subscribeToSync = () => (dispatch) =>
    socket.on('devices:sync', (devices) =>
        dispatch({
            type: 'app/SYNC_DEVICES',
            data: {
                devices
            }
        })
    );

export const disconnectDevice = () => (_, getState) => {
    const {
        app: { deviceId }
    } = getState();

    socket.emit('device:delete', deviceId);
};

export const setActiveDevice = (id) => (_, getState) => {
    const {
        app: { devices }
    } = getState();

    const { deviceId } = devices.find(({ isMaster }) => isMaster) || {};

    if (id !== deviceId) {
        socket.emit('device:active', id);
    }
};
