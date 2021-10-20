import { v4 as uuidv4 } from 'uuid';

export interface AppState {
    isLoading: boolean;
    devices: string[];
    deviceId: string;
}

export const initialState: AppState = {
    isLoading: false,
    devices: [],
    deviceId: uuidv4()
};
