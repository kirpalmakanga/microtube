import moment from 'moment';

export const preventDefault = (e) => e.preventDefault();

export const getThumbnails = (thumbnails, size = 'default') => {
    return thumbnails[size].url.replace('http:', 'https:');
};

export const formatDate = (date, format) => moment(date).format(format);

export const parseDuration = (PT = '') => {
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

    for (let i = 0; i < parts.length; i++) {
        if (typeof matches[parts[i].pos] !== 'undefined') {
            durationInSec +=
                parseInt(matches[parts[i].pos]) * parts[i].multiplier;
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

export const flatten = (arr) =>
    arr.reduce((flat, next) => flat.concat(next), []);

export const parseURLSearchParams = (search) => {
    const params = new URLSearchParams(search);

    return [...params.entries()].reduce(
        (obj, [key, value]) => ({ ...obj, [key]: value }),
        {}
    );
};

export const isMobile =
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i);

export const parseID = (url) => {
    url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
};

export const pick = (obj, whitelist = []) =>
    Object.keys(obj).reduce(
        (newObj, key) => ({
            ...newObj,
            ...(whitelist.includes(key) ? { [key]: obj[key] } : {})
        }),
        {}
    );
