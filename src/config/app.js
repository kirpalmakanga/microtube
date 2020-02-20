export const STORAGE_KEY = 'microtube';

export const __DEV__ = process.env.NODE_ENV === 'development';

export const SOCKET_URL = __DEV__
    ? 'http://localhost:8081'
    : 'https://microtube-socket.herokuapp.com';
