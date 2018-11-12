import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';

import { preventDefault } from '../../lib/helpers';

import formatTime from '../../lib/formatTime';

import Queue from './Queue';
import Screen from './Screen';

import Button from './controls/Button';
import VolumeRange from './controls/VolumeRange';
import InfoTime from './controls/InfoTime';
import InfoProgress from './controls/InfoProgress';

class Player extends Component {
  constructor(props) {
    super(props);

    const currentVideo = props.player.queue.find(({ active }) => active) || {
      title: 'No video.',
      videoId: null
    };

    this.state = {
      isPlaying: false,
      isBuffering: false,
      isMuted: false,
      showQueue: false,
      showScreen: false,
      showVolume: false,
      volume: 100,
      loaded: 0,
      currentTime: 0,
      duration: 0,
      youtube: null,
      autoplay: 0,
      timeWatcher: null,
      loadingWatcher: null,
      currentIndex: null,
      currentVideo
    };
  }

  componentWillReceiveProps({ player: { queue } }) {
    const activeQueueItem = queue.find(({ active }) => active);

    this.setCurrentVideo(activeQueueItem);
  }

  setCurrentVideo({ title = 'No video.', videoId = null } = {}) {
    const { videoId: currentVideoId } = this.state.currentVideo;

    if (videoId === null) {
      return this.setState({
        currentTime: 0,
        duration: 0,
        loaded: 0
      });
    }

    this.setState({ currentVideo: { title, videoId } });
  }

  isPlayerReady = () => {
    const {
      youtube,
      currentVideo: { videoId }
    } = this.state;

    return !!youtube && videoId;
  };

  updateTime = (currentTime) =>
    this.setState({
      currentTime: currentTime || this.state.youtube.getCurrentTime()
    });

  setVolume = (volume) => {
    if (!this.isPlayerReady()) {
      return;
    }

    const { youtube } = this.state;

    if (volume > 0) {
      youtube.unMute();
    }

    youtube.setVolume(volume);

    this.setState({ volume }, () => {
      this.props.dispatch({ type: 'SET_VOLUME', data: volume });
    });
  };

  handleWheelVolume = ({ deltaY }) => {
    const { volume } = this.state;
    let newVolume, inRange;

    if (!this.isPlayerReady()) {
      return;
    }

    newVolume = deltaY < 0 ? volume + 5 : volume - 5;
    inRange = newVolume >= 0 && newVolume <= 100;

    if (inRange) {
      this.setVolume(newVolume);
    }
  };

  setVideoTime = throttle(({ target: { value } }) => {
    if (!this.isPlayerReady()) {
      return;
    }

    let { duration, youtube } = this.state;

    let t = duration * (value / duration);

    this.clearWatchers();

    youtube.seekTo(t);

    this.updateTime(t);
  }, 200);

  watchTime() {
    const { youtube } = this.state;

    const duration = youtube.getDuration();

    this.setState({
      duration,
      timeWatcher: setInterval(() => {
        this.updateTime();

        if (youtube.getCurrentTime() === duration) {
          clearInterval(timeWatcher);
        }
      }, 250)
    });

    this.updateTime();
  }

  watchLoading() {
    const { youtube } = this.state;

    const loadingWatcher = setInterval(() => {
      const loaded = youtube.getVideoLoadedFraction();

      this.setState({ loaded });

      if (loaded === 1) {
        clearInterval(loadingWatcher);
      }
    }, 500);

    this.setState({ loaded: youtube.getVideoLoadedFraction() });

    this.setState({ loadingWatcher });
  }

  toggleMute = () => {
    const { isMuted, youtube } = this.state;

    if (!this.isPlayerReady()) {
      return;
    }

    if (isMuted) {
      youtube.unMute();
    } else {
      youtube.mute();
    }

    this.setState({ isMuted: !isMuted });
  };

  togglePlay = () => {
    const { isPlaying, youtube } = this.state;

    if (!this.isPlayerReady()) {
      return;
    }

    if (isPlaying) {
      return youtube.pauseVideo();
    }

    youtube.playVideo();
  };

  clearWatchers() {
    const { timeWatcher, loadingWatcher } = this.state;
    clearInterval(timeWatcher);
    clearInterval(loadingWatcher);
  }

  goToVideo = (next = true) => {
    const { queue } = this.props.player;

    const currentIndex = queue.findIndex((v) => v.active) || 0;

    const newIndex = currentIndex + (next ? 1 : -1);

    if (newIndex < 0 || newIndex > queue.length - 1) {
      return;
    }

    this.clearWatchers();

    this.setState({
      currentTime: 0,
      loaded: 0
    });

    this.props.dispatch({
      type: 'QUEUE_SET_ACTIVE_ITEM',
      data: { index: newIndex }
    });
  };

  onYoutubeIframeReady = ({ target }) => {
    const { volume } = this.props.player;

    target.pauseVideo();
    this.setState({ youtube: target }, () => this.setVolume(volume));
  };

  onYoutubeIframeStateChange = ({ data }) => {
    switch (data) {
      case -1:
      case 0:
        this.setState({ isPlaying: false });
        break;

      case 1:
        this.setState({ isPlaying: true, isBuffering: false }, () => {
          this.watchTime();
          this.watchLoading();
        });
        break;

      case 2:
        this.clearWatchers();
        this.setState({ isPlaying: false });
        break;

      case 3:
        this.clearWatchers();
        this.setState({ isBuffering: true });
        break;

      case 5:
        this.togglePlay();
        break;
    }
  };

  render() {
    const {
      props: { player, dispatch },
      state: {
        isPlaying,
        isBuffering,
        isMuted,
        volume,
        loaded,
        currentTime,
        duration,
        currentVideo
      },
      handleWheelVolume,
      setVolume,
      setVideoTime,
      toggleMute,
      togglePlay,
      goToVideo,
      onYoutubeIframeReady,
      onYoutubeIframeStateChange
    } = this;

    const { showQueue, showScreen, newQueueItems } = player;

    /* TODO: Déplacer dans le header */

    const documentTitle = `Microtube | ${currentVideo.title} - ${formatTime(
      currentTime
    )} / ${formatTime(duration)}`;

    return (
      <div className='player__container'>
        <Queue
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          togglePlay={togglePlay}
        />

        <div
          className={[
            'screen shadow--2dp',
            player.showScreen ? 'screen--show' : ''
          ].join(' ')}
        >
          <Screen
            videoId={currentVideo.videoId}
            onReady={onYoutubeIframeReady}
            onEnd={goToVideo}
            onStateChange={onYoutubeIframeStateChange}
          />
        </div>

        <div className='player shadow--2dp'>
          <div className='player__controls'>
            <Button
              className='player__controls-button icon-button'
              onClick={() => goToVideo(false)}
              icon='skip-previous'
              ariaLabel='Go to previous video'
            />

            <Button
              className='player__controls-button icon-button'
              onClick={togglePlay}
              icon={isBuffering ? 'loading' : isPlaying ? 'pause' : 'play'}
              iconTransitionClass={!isPlaying && isBuffering ? 'rotating' : ''}
              ariaLabel={isPlaying ? 'Pause video' : 'Play video'}
            />

            <Button
              className='player__controls-button icon-button'
              onClick={() => goToVideo(true)}
              icon='skip-next'
              ariaLabel='Go to next video'
            />
          </div>

          <div className='player__info'>
            <InfoProgress
              percentElapsed={duration ? currentTime / duration : 0}
              percentLoaded={loaded}
            />

            <div className='player__info-title'>{currentVideo.title}</div>

            <InfoTime currentTime={currentTime} duration={duration} />

            <label className='sr-only' labelfor='seek-time'>
              Seek time
            </label>

            <input
              id='seek-time'
              className='player__info-progress-loaded'
              type='range'
              min='0'
              max={parseInt(duration)}
              onWheel={preventDefault}
              onChange={setVideoTime}
            />
          </div>

          <div className='player__controls'>
            <Button
              className={[
                'player__controls-button badge icon-button',
                showQueue ? 'is-active' : '',
                newQueueItems ? 'badge--active' : ''
              ].join(' ')}
              onClick={() =>
                dispatch({
                  type: showQueue ? 'QUEUE_CLOSE' : 'QUEUE_OPEN'
                })
              }
              badge={newQueueItems}
              icon='list'
              ariaLabel={showQueue ? 'Close queue' : 'Open queue'}
            />

            <Button
              className={[
                'player__controls-button icon-button',
                showScreen ? 'is-active' : ''
              ].join(' ')}
              onClick={() =>
                dispatch({
                  type: showScreen ? 'SCREEN_CLOSE' : 'SCREEN_OPEN'
                })
              }
              icon='film'
              title={showScreen ? 'Close screen' : 'open screen'}
            />

            <div
              className='player__controls-volume'
              onWheel={handleWheelVolume}
            >
              <Button
                className='player__controls-button icon-button'
                onClick={toggleMute}
                icon={
                  isMuted
                    ? 'volume-mute'
                    : volume >= 50
                    ? 'volume-up'
                    : volume > 0 && volume <= 50
                    ? 'volume-down'
                    : 'volume-off'
                }
                title={isMuted ? 'Unmute' : 'Mute'}
              />

              <VolumeRange
                value={volume}
                onChange={({ target }) => setVolume(target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ player }) => ({ player });

export default connect(mapStateToProps)(Player);
