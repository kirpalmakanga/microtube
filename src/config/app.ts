export const STORAGE_KEY: string = 'microtube';

export const __DEV__: boolean = process.env.NODE_ENV === 'development';

export const SOCKET_URL: string = __DEV__
    ? 'http://localhost:8081'
    : 'https://microtube-socket.herokuapp.com';
