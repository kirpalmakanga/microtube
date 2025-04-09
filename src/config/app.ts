export const STORAGE_KEY: string = 'microtube';

// @ts-ignore
export const IS_DEV_MODE: boolean = import.meta.env.MODE === 'development';

export const API_URL: string = IS_DEV_MODE
    ? 'https://api.microtube.dev'
    : 'https://microtube-api.vercel.app';
