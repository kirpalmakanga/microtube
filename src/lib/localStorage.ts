import { STORAGE_KEY } from '../config/app';
import { captureError } from './helpers';

export const saveState = (state: GenericObject) => {
    try {
        const serializedState = JSON.stringify(state);

        localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (error) {
        captureError(error);
    }
};

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);

        return serializedState === null ? undefined : JSON.parse(serializedState);
    } catch (error) {
        captureError(error);

        return undefined;
    }
};
