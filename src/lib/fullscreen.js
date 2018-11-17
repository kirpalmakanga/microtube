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

  Object.entries(events).forEach(([key, fullScreenElementKey]) => {
    document.addEventListener(
      key,
      () => {
        const fullScreenElement = document[fullScreenElementKey];
        const isFullScreen = fullScreenElement === element;

        callback(isFullScreen);
      },
      true
    );
  });
};
