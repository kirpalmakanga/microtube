import { format } from 'date-fns';

export const preventDefault = (func = () => {}) => (e) => {
    e.preventDefault();

    func && func(e);
};

export const stopPropagation = (func) => (e) => {
    e.stopPropagation();
    func && func(e);
};

export const getThumbnails = (thumbnails, size = 'default') => {
    const { url = '' } = thumbnails[size] || {};

    return url.replace('http:', 'https:');
};

export const formatDate = (date, formatString) =>
    format(new Date(date), formatString);

export const parseDuration = (PT = '') => {
    if (!PT) {
        return 0;
    }

    const matches = PT.match(
        /P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T?(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i
    );

    const parts = [
        {
            // years
            pos: 1,
            multiplier: 86400 * 365
        },
        {
            // months
            pos: 2,
            multiplier: 86400 * 30
        },
        {
            // weeks
            pos: 3,
            multiplier: 604800
        },
        {
            // days
            pos: 4,
            multiplier: 86400
        },
        {
            // hours
            pos: 5,
            multiplier: 3600
        },
        {
            // minutes
            pos: 6,
            multiplier: 60
        },
        {
            // seconds
            pos: 7,
            multiplier: 1
        }
    ];

    let durationInSec = 0;

    for (const { pos, multiplier } of parts) {
        if (matches[pos]) {
            durationInSec += parseInt(matches[pos]) * multiplier;
        }
    }

    return durationInSec;
};

export const formatTime = (t) => {
    const hours = Math.floor(t / 3600);
    const minutes = Math.floor((t - hours * 3600) / 60);
    const seconds = Math.floor(t - (hours * 3600 + minutes * 60));

    const units = [minutes, seconds];

    if (hours) {
        units.unshift(hours);
    }

    return units.map((unit) => `${unit}`.padStart(2, '0')).join(':');
};

export const isMobile = () => {
    const { userAgent = '' } = navigator;

    return userAgent.match(
        /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i
    );
};

export const parseVideoId = (url) => {
    url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
};

export const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

export const splitLines = (str) => str.match(/[^\r\n]+/g) || [];

export const chunk = (array = [], size) => {
    const chunks = [];

    let index = 0;

    while (index < array.length) {
        chunks.push(array.slice(index, size + index));

        index += size;
    }

    return chunks;
};

export const throttle = (fn, delay = 50) => {
    let lastCall = 0;

    return (...args) => {
        const now = new Date().getTime();

        if (now - lastCall < delay) {
            return;
        }

        lastCall = now;

        return fn(...args);
    };
};

export const debounce = (callback, delay) => {
    let timer;

    return function() {
        const args = arguments;
        const context = this;

        clearTimeout(timer);

        timer = setTimeout(() => callback.apply(context, args), delay);
    };
};

export const pick = (obj = {}, whitelist = []) => {
    if (!whitelist.length) {
        return obj;
    }

    const result = {};

    for (const key of whitelist) {
        if (obj[key]) {
            result[key] = obj[key];
        }
    }

    return result;
};

export const omit = (obj = {}, blacklist = []) => {
    const result = {};

    for (const key in obj) {
        if (!blacklist.includes(key)) {
            result[key] = obj[key];
        }
    }

    return result;
};

export const catchErrors = async (
    fn = async () => {},
    onError = () => {},
    anyway = async () => {}
) => {
    try {
        await fn();
    } catch (error) {
        console.error(error);
        onError(error);
    } finally {
        return anyway();
    }
};

export const uuidv4 = () =>
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );

export const mergeDeep = (target, source) => {
    const result = { ...target, ...source };
    const keys = Object.keys(result);

    for (const key of keys) {
        const tprop = target[key];
        const sprop = source[key];
        //if two objects are in conflict

        if (
            tprop instanceof Object &&
            !Array.isArray(tprop) &&
            sprop instanceof Object &&
            !Array.isArray(sprop)
        ) {
            result[key] = mergeDeep(tprop, sprop);
        }
    }

    return result;
};
