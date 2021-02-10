import { uuidv4, delay } from '../../lib/helpers';

import { listen, publish } from '../../api/socket';

export const setDevice = () => (dispatch, getState) => {
    const { appCodeName: deviceName } = navigator;
    const {
        app: { deviceId }
    } = getState();

    if (!deviceId) {
        // deviceId = uuidv4();

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
