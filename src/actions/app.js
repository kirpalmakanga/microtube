import { uuidv4 } from '../lib/helpers';

import { loadAPI, getAuthInstance as loadAuth } from '../api/youtube';

import { listen, publish } from '../api/socket';

export const subscribeToSync = () => (dispatch) =>
    listen('devices:sync', (devices) =>
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

    publish('device:delete', deviceId);
};

export const setActiveDevice = (id) => (_, getState) => {
    const {
        app: { devices }
    } = getState();

    const { deviceId } = devices.find(({ isMaster }) => isMaster) || {};

    if (id !== deviceId) {
        publish('device:active', id);
    }
};

export const connectDevice = () => (dispatch, getState) => {
    listen('connect', () => {
        const {
            auth: {
                user: { id: userId }
            }
        } = getState();

        publish('room', userId);

        dispatch(setDevice());

        dispatch(subscribeToSync());
    });
};

export const initializeApp = () => async (dispatch) => {
    await loadAPI();

    await loadAuth();
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

    publish('device:add', { deviceId, deviceName });
};
