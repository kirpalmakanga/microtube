import updateState from '../lib/updateState'

const initialState = {
  queue: [],
  isPlaying: false,
  isBuffering: false,
  showQueue: false,
  showScreen: false,
  showVolume: false,
  isMuted: false,
  volume: 100,
  loaded: 0,
  currentTime: 0,
  duration: 0,
  youtube: null,
  watchers: {
    time: null,
    loading: null
  },
  newQueueItems: 0
}

const actions = {

    'GET_YOUTUBE': youtube => ({ youtube }),

    'SET_WATCHERS': ({ time, loading }) => ({ watchers: { time, loading } }),

    'CLEAR_WATCHERS': (data, { watchers }) => {
      clearInterval(watchers.time)
      clearInterval(watchers.loading)
      return { watchers: initialState.watchers }
    },

    'BUFFER': () => ({ isBuffering: true }),

    'PLAY': () => ({ isPlaying: true, isBuffering: false }),

    'PAUSE': () => ({ isPlaying: false }),

    'UPDATE_TIME': ({ currentTime, duration }) => ({ currentTime, duration }),

    'UPDATE_LOAD': loaded => ({ loaded }),

    'SCREEN_OPEN': () => ({
      showScreen: true,
      showQueue: false
    }),

    'SCREEN_CLOSE': () => ({ showScreen: false }),

    'QUEUE_OPEN': () => ({
      showQueue: true,
      showScreen: false,
      newQueueItems: initialState.newQueueItems
    }),

    'QUEUE_CLOSE': () => ({ showQueue: false }),

    'QUEUE_PUSH': (items, { queue, newQueueItems }) => {
      newQueueItems += items.length
      return {
        queue: [...queue, ...items],
        newQueueItems
      }
    },

    'QUEUE_REMOVE': (index, { queue }) => ({ queue: queue.filter((item, i) => i !== index) }),

    'QUEUE_CLEAR': video => ({ queue: video.videoId ? [video] : initialState.queue }),

    'QUEUE_SET': queue => ({ queue }),

    'OPEN_VOLUME': () => ({ showVolume: true }),

    'CLOSE_VOLUME': () => ({ showVolume: false }),

    'SET_VOLUME': data => ({ isMuted: false, volume: data }),

    'MUTE': () => ({ isMuted: true }),

    'UNMUTE': () => ({ isMuted: false })
}

export default updateState(actions, initialState)
