import { STORAGE_KEY } from '../config/app';

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);

        localStorage.setItem(STORAGE_KEY, serializedState);

        return serializedState === null
            ? undefined
            : JSON.parse(serializedState);
    } catch (error) {}
};

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);

        return serializedState === null
            ? undefined
            : JSON.parse(serializedState);
    } catch (error) {
        return undefined;
    }
};
