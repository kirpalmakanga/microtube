import { format } from 'date-fns';

export const preventDefault =
    (func = (e: Event) => {}) =>
    (e: Event) => {
        e.preventDefault();

        func(e);
    };

export const stopPropagation =
    (func = (e: Event) => {}) =>
    (e: Event) => {
        e.stopPropagation();
        func && func(e);
    };

export const getThumbnails = (
    thumbnails: ThumbnailsData,
    size: string
): string => {
    const {
        [size]: { url = '' }
    } = thumbnails;

    return url.replace('http:', 'https:');
};

export const formatDate = (date: string, formatString: string) =>
    format(new Date(date), formatString);

export const parseDuration = (PT: string) => {
    if (!PT) {
        return 0;
    }

    const matches =
        PT.match(
            /P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T?(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i
        ) ?? [];

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
        const { [pos]: time } = matches;

        if (time) {
            durationInSec += parseInt(time) * multiplier;
        }
    }

    return durationInSec;
};

export const formatTime = (t: number) => {
    const hours = Math.floor(t / 3600);
    const minutes = Math.floor((t - hours * 3600) / 60);
    const seconds = Math.floor(t - (hours * 3600 + minutes * 60));

    const units = [minutes, seconds];

    if (hours) units.unshift(hours);

    return units.map((unit) => `${unit}`.padStart(2, '0')).join(':');
};

export const isMobile = () => {
    const { userAgent = '' } = navigator;

    return !!userAgent.match(
        /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i
    );
};

export const parseVideoId = (url: string) => {
    const parts = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);

    return parts[2] !== undefined
        ? parts[2].split(/[^0-9a-z_\-]/i)[0]
        : parts[0];
};

export const delay = (t: number) =>
    new Promise((resolve) => setTimeout(resolve, t));

export const splitLines = (str: string) => str.match(/[^\r\n]+/g) || [];

export const chunk = (array: any[] = [], size: number) => {
    const chunks = [];

    let index = 0;

    while (index < array.length) {
        chunks.push(array.slice(index, size + index));

        index += size;
    }

    return chunks;
};

export const throttle = (callback: (...args: any[]) => void, delay = 50) => {
    let lastCall = 0;

    return (...args: any[]) => {
        const now = Date.now();

        if (now - lastCall >= delay) {
            lastCall = now;

            callback(...args);
        }
    };
};

export const debounce = (callback: (...args: any[]) => void, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: any[]) => {
        clearTimeout(timer);

        timer = setTimeout(() => callback(...args), delay);
    };
};

export function pick<T extends object, K extends keyof T>(
    base: T,
    ...keys: K[]
): Pick<T, K> {
    if (!keys.length) return base;

    const entries = keys.map((key) => [key, base[key]]);

    return Object.fromEntries(entries);
}

export function omit<T extends object, K extends keyof T>(
    base: T,
    ...keys: K[]
): Omit<T, K> {
    if (!keys.length) return base;

    const result = { ...base };

    for (const key of keys) delete result[key];

    return result;
}

export const wrapURLs = (text: string) => {
    const urlPattern =
        /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

    const pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

    return text
        .replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
        .replace(
            pseudoUrlPattern,
            '$1<a href="http://$2" target="_blank">$2</a>'
        )
        .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
};

export const loadScript = async (src: string) => {
    if (!document.querySelector(`script[src="${src}"]`)) {
        const js = document.createElement('script');

        document.body.appendChild(js);

        return new Promise((resolve, reject) => {
            js.onload = resolve;
            js.onerror = reject;

            js.src = src;
        });
    }
};

export const setImmediateInterval = (
    handler: Function,
    timeout?: number
): number => {
    handler();

    return setInterval(handler, timeout);
};

export const getVideoURL = (id: string) => `https://youtu.be/${id}`;

export const getPlaylistURL = (id: string) =>
    `https://youtube.com/playlist?list=${id}`;

export const shareURL = (config: ShareConfig) => navigator.share(config);

export const copyText = (text: string) => navigator.clipboard.writeText(text);

const isObject = (item: unknown) =>
    item !== null && typeof item === 'object' && !Array.isArray(item);

export const mergeDeep = (
    target: { [key: string]: any },
    ...sources: { [key: string]: any }[]
): Object => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
};

export const isEqual = (obj1: unknown, obj2: unknown) => {
    type GenericObject = {
        [key: string]: unknown;
    };

    function getType(obj: unknown) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }

    function areArraysEqual(arr1: unknown[], arr2: unknown[]) {
        if (arr1.length !== arr2.length) return false;

        for (let i = 0; i < arr1.length; i++) {
            if (!isEqual(arr1[i], arr2[i])) return false;
        }

        return true;
    }

    function areObjectsEqual(obj1: GenericObject, obj2: GenericObject) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

        for (let key in obj1) {
            if (Object.prototype.hasOwnProperty.call(obj1, key)) {
                if (!isEqual(obj1[key], obj2[key])) return false;
            }
        }

        return true;
    }

    function areFunctionsEqual(func1: Function, func2: Function) {
        return func1.toString() === func2.toString();
    }

    function arePrimitivesEqual(primitive1: unknown, primitive2: unknown) {
        return primitive1 === primitive2;
    }

    let type = getType(obj1);

    if (type !== getType(obj2)) return false;

    if (type === 'array')
        return areArraysEqual(obj1 as unknown[], obj2 as unknown[]);
    if (type === 'object')
        return areObjectsEqual(obj1 as GenericObject, obj2 as GenericObject);
    if (type === 'function')
        return areFunctionsEqual(obj1 as Function, obj2 as Function);
    return arePrimitivesEqual(obj1, obj2);
};
