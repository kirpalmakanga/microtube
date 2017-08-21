import updateState from '../updateState'

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
  youtube: {},
  autoplay: 0,
  watchers: {
    time: null,
    loading: null
  },
  newQueueItems: 0,
  notify: false
}

const actions = {

    'GET_YOUTUBE': youtube => ({ youtube }),

    'SET_WATCHERS': ({ time, loading }) => ({ watchers: { time, loading } }),

    'CLEAR_WATCHERS': (data, { watchers }) => {
      clearInterval(watchers.time)
      clearInterval(watchers.loading)
      return { watchers: initialState.watchers }
    },

    'ENABLE_AUTOPLAY': () => ({ autoplay: 1 }),

    'RESET_TIME': () => ({
      currentTime: 0,
      loaded: 0,
    }),

    'BUFFER': () => ({ isBuffering: true }),

    'PLAY': () => ({ isPlaying: true, isBuffering: false, notify: true }),

    'PAUSE': () => ({ isPlaying: false, notify: false }),

    'UPDATE_TIME': ({ currentTime, duration }, state) => ({ currentTime, duration: duration || state.duration }),

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

    'QUEUE_CLEAR': (data, { queue }) => {
      queue = queue.filter(v => v.active)
      return Object.assign({ queue }, !queue.length ? {
        currentTime: 0,
        loaded: 0,
      } : {})
    },

    'QUEUE_SET': queue => ({ queue, notify: true }),

    'OPEN_VOLUME': () => ({ showVolume: true }),

    'CLOSE_VOLUME': () => ({ showVolume: false }),

    'SET_VOLUME': data => ({ isMuted: false, volume: data }),

    'MUTE': () => ({ isMuted: true }),

    'UNMUTE': () => ({ isMuted: false })
}

export default updateState(actions, initialState)
