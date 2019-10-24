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

    for (let part of parts) {
        const { pos, multiplier } = part;

        if (matches[pos]) {
            durationInSec += parseInt(matches[pos]) * multiplier;
        }
    }

    return durationInSec;
};

export const formatTime = (t) => {
    let hours,
        minutes,
        seconds = 0;

    hours = Math.floor(t / 3600) % 24;

    t = t - hours * 3600;

    minutes = Math.floor(t / 60) % 60;

    t = t - minutes * 60;

    seconds = Math.floor(t);

    const units = [minutes, seconds];

    if (hours) {
        units.unshift(hours);
    }

    return units.map((t) => ('0' + t).slice(-2)).join(':');
};

export const isMobile = () => {
    const { userAgent = '' } = navigator;

    return (
        userAgent.match(/Android/i) ||
        userAgent.match(/webOS/i) ||
        userAgent.match(/iPhone/i) ||
        userAgent.match(/iPad/i) ||
        userAgent.match(/iPod/i) ||
        userAgent.match(/BlackBerry/i) ||
        userAgent.match(/Windows Phone/i)
    );
};

export const parseID = (url) => {
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

export const pick = (obj = {}, whitelist = []) =>
    Object.keys(obj).reduce(
        (newObj, key) => ({
            ...newObj,
            ...(whitelist.includes(key) ? { [key]: obj[key] } : {})
        }),
        {}
    );

export const omit = (obj, blacklist = []) => {
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
        onError(error);
    } finally {
        return anyway();
    }
};
