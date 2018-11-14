import moment from 'moment';
import RssParser from 'rss-parser';

const parser = new RssParser();

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
    let output = [];
    let durationInSec = 0;

    for (let i = 0; i < parts.length; i++) {
        if (typeof matches[parts[i].pos] !== 'undefined') {
            durationInSec +=
                parseInt(matches[parts[i].pos]) * parts[i].multiplier;
        }
    }

    // Hours extraction
    if (durationInSec > 3599) {
        output.push(parseInt(durationInSec / 3600));
        durationInSec %= 3600;
    }
    // Minutes extraction with leading zero
    output.push(('0' + parseInt(durationInSec / 60)).slice(-2));
    // Seconds extraction with leading zero
    output.push(('0' + (durationInSec % 60)).slice(-2));

    return output.join(':');
};

export const flatten = (arr) =>
    arr.reduce((flat, next) => flat.concat(next), []);

export const parseFeed = (feedurl) => parser.parseURL(feedurl);

export const enableFullScreen = (element) => {
    element.requestFullscreen
        ? element.requestFullscreen()
        : element.mozRequestFullScreen
        ? element.mozRequestFullScreen()
        : element.webkitRequestFullscreen
        ? element.webkitRequestFullscreen()
        : element.msRequestFullscreen && element.msRequestFullscreen();
};

export const exitFullScreen = () => {
    document.exitFullscreen
        ? document.exitFullscreen()
        : document.mozCancelFullScreen
        ? document.mozCancelFullScreen()
        : document.webkitExitFullscreen
        ? document.webkitExitFullscreen()
        : document.msExitFullscreen && document.msExitFullscreen();
};

export const listenFullScreenChange = (element, callback) => {
    const events = {
        fullscreenchange: 'fullscreenElement',
        webkitfullscreenchange: 'webkitFullscreenElement',
        mozfullscreenchange: 'mozFullScreenElement',
        msfullscreenchange: 'msFullscreenElement'
    };

    Object.entries(events).forEach(([key, elementKey]) => {
        document.addEventListener(
            key,
            (e) => {
                const fullScreenElement = e.target[elementKey];
                const isFullScreen = fullScreenElement === element;

                callback(isFullScreen);
            },
            true
        );
    });
};
