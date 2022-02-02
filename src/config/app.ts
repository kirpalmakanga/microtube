export const STORAGE_KEY: string = 'microtube';

// @ts-ignore
export const IS_DEV_MODE: boolean = import.meta.env.MODE === 'development';

export const SOCKET_URL: string = IS_DEV_MODE
    ? 'http://localhost:8081'
    : 'https://microtube-socket.herokuapp.com';
