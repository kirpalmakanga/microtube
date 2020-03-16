import { createReducer } from '../helpers';

const initialState = {
    isLoading: false,
    devices: [],
    deviceId: ''
};

export default createReducer(initialState, {
    'app/SET_LOADER': (state, { isLoading }) => ({ ...state, isLoading }),

    'app/SET_DEVICE_ID': (state, { deviceId }) => ({
        ...state,
        deviceId
    }),

    'app/SYNC_DEVICES': (state, { devices }) => ({
        ...state,
        devices
    }),

    'app/CLEAR_DEVICES': (state) => ({
        ...state,
        devices: initialState.devices
    })
});
