import { createReducer, State } from '../helpers';

export interface AppState extends State {
    isLoading: boolean,
    devices: string[],
    deviceId: string
}

export const initialState: AppState = {
    isLoading: false,
    devices: [],
    deviceId: ''
};

export default createReducer(initialState, {
    'app/SET_LOADER': (state: State, { isLoading }: State) => ({ ...state, isLoading }),

    'app/SET_DEVICE_ID': (state: State, { deviceId }: State) => ({
        ...state,
        deviceId
    }),

    'app/SYNC_DEVICES': (state: State, { devices }: State) => ({
        ...state,
        devices
    }),

    'app/CLEAR_DEVICES': (state: State) => ({
        ...state,
        devices: initialState.devices
    })
});
