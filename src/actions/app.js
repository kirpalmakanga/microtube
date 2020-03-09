import { uuidv4, delay } from '../lib/helpers';

import { loadAPI, getAuthInstance as loadAuth } from '../api/youtube';

import { listen, publish } from '../api/socket';

export const initializeApp = () => async () => {
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

export const listenDevicesSync = () => (dispatch) =>
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

        listen('disconnect', () =>
            dispatch({
                type: 'app/CLEAR_DEVICES'
            })
        );

        dispatch(setDevice());

        dispatch(listenDevicesSync());
    });
};

export const notify = ({ message }) => async (dispatch, getState) => {
    dispatch({ type: 'notifications/OPEN', data: { message } });

    await delay(4000);

    const {
        notifications: { message: storedMessage }
    } = getState();

    if (storedMessage) {
        dispatch({ type: 'notifications/CLOSE' });

        await delay(300);

        dispatch({ type: 'notifications/CLEAR_MESSAGE' });
    }
};

export const closeNotification = () => async (dispatch) => {
    dispatch({ type: 'notifications/CLOSE' });

    await delay(300);

    dispatch({ type: 'notifications/CLEAR_MESSAGE' });
};

export const prompt = (config = {}, callback = async () => {}) => (dispatch) =>
    dispatch({
        type: 'prompt/OPEN',
        data: {
            ...config,
            callback: async (data) => {
                await callback(data);

                dispatch(closePrompt());
            }
        }
    });

export const closePrompt = () => async (dispatch) => {
    dispatch({ type: 'prompt/CLOSE' });

    await delay(300);

    dispatch({ type: 'prompt/RESET' });
};
