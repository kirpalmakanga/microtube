import { v4 as uuidv4 } from 'uuid';
import { createReducer, State } from '../helpers';

export interface AppState extends State {
    isLoading: boolean;
    devices: string[];
    deviceId: string;
}

export const initialState: AppState = {
    isLoading: false,
    devices: [],
    deviceId: uuidv4()
};

export default createReducer(initialState, {
    'app/UPDATE_DATA': (state: State, data: State) => ({
        ...state,
        ...data
    }),

    'app/CLEAR_DEVICES': (state: State) => ({
        ...state,
        devices: initialState.devices
    })
});
