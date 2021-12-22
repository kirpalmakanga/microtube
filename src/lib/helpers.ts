import { ThumbnailsData, ShareConfig } from '../../@types/alltypes';
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
    const entries = keys.map((key) => [key, base[key]]);

    return Object.fromEntries(entries);
}

export function omit<T extends object, K extends keyof T>(
    base: T,
    ...keys: K[]
): Omit<T, K> {
    const result = { ...base };

    for (const key of keys) delete result[key];

    return result;
}

export const wrapURLs = (text: string) => {
    // http://, https://, ftp://
    const urlPattern =
        /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

    // www. sans http:// or https://
    const pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    // Email addresses
    const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

    return text
        .replace(urlPattern, '<a href="$&">$&</a>')
        .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
        .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
};

export const loadScript = (src: string) => {
    return new Promise((resolve: (value?: unknown) => void, reject) => {
        try {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
            } else {
                const js = document.createElement('script');

                document.body.appendChild(js);

                js.src = src;
                js.onload = resolve;
            }
        } catch (err) {
            reject(err);
        }
    });
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
