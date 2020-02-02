import { createReducer } from '../helpers.js';

const initialState = {
    isLoading: false,
    devices: [],
    deviceId: '',
    deviceName: '',
    isMaster: false
};

export default createReducer(initialState, {
    'app/SET_LOADER': (state, { data: isLoading }) => ({ ...state, isLoading }),

    'app/SET_DEVICE_ID': (state, { data: { deviceId } }) => ({
        ...state,
        deviceId
    }),

    'app/SYNC_DEVICES': (state, { data: { devices } }) => ({
        ...state,
        devices,
        ...(devices.length === 1 ? { isMaster: true } : {})
    }),

    'app/ADD_DEVICE': ({ devices, ...state }, { data: { id } }) => ({
        ...state,
        devices: [...devices, id]
    }),

    'app/REMOVE_DEVICE': (
        { devices, ...state },
        { data: { id: deletedId } }
    ) => ({
        ...state,
        devices: devices.filter((id) => id === deletedId)
    }),

    'app/SET_ACTIVE_DEVICE': (state) => ({
        ...state,
        isMaster: true
    })
});
