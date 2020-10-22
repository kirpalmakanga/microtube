import { useRef, useState, useEffect } from 'react';

const enableFullScreen = (element) => {
    element.requestFullscreen
        ? element.requestFullscreen()
        : element.mozRequestFullScreen
        ? element.mozRequestFullScreen()
        : element.webkitRequestFullscreen
        ? element.webkitRequestFullscreen()
        : element.msRequestFullscreen && element.msRequestFullscreen();
};

const exitFullScreen = () => {
    document.exitFullscreen
        ? document.exitFullscreen()
        : document.mozCancelFullScreen
        ? document.mozCancelFullScreen()
        : document.webkitExitFullscreen
        ? document.webkitExitFullscreen()
        : document.msExitFullscreen && document.msExitFullscreen();
};

const listenFullScreenChange = (element, callback) => {
    const events = {
        fullscreenchange: 'fullscreenElement',
        webkitfullscreenchange: 'webkitFullscreenElement',
        mozfullscreenchange: 'mozFullScreenElement',
        msfullscreenchange: 'msFullscreenElement'
    };

    Object.entries(events).forEach(([key, fullScreenElementKey]) => {
        document.addEventListener(
            key,
            () => {
                const fullScreenElement = document[fullScreenElementKey];
                const isFullscreen = fullScreenElement === element;

                callback(isFullscreen);
            },
            true
        );
    });
};

const FullscreenWrapper = ({ children = () => {} }) => {
    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        const { current: container } = containerRef;

        if (!isFullscreen) {
            enableFullScreen(container);
        } else {
            exitFullScreen();
        }

        setIsFullscreen(!isFullscreen);
    };

    useEffect(() => {
        const { current: container } = containerRef;

        if (container) {
            listenFullScreenChange(container, setIsFullscreen);
        }
    }, []);

    return children({ toggleFullscreen, containerRef, isFullscreen });
};

export default FullscreenWrapper;
