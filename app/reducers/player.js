const initialState = {
  queue: [],
  isPlaying: false,
  isBuffering: false,
  showQueue: false,
  showScreen: false,
  showVolume: false,
  isMuted: false,
  volume: 100,
  video: {
    videoId: null
  },
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

export default function(state = initialState, action) {
  const { queue, video, duration } = state
  let currentIndex

  switch (action.type) {
    case 'GET_YOUTUBE':
      return Object.assign({}, state, { youtube: action.youtube })

    case 'SET_WATCHERS':
      return Object.assign({}, state, {
        watchers: {
          time: action.time,
          loading: action.loading
        }
      })

    case 'CLEAR_WATCHERS':
      clearInterval(state.watchers.time)
      clearInterval(state.watchers.loading)
      return Object.assign({}, state, { watchers: initialState.watchers })

    case 'BUFFER':
      return Object.assign({}, state, { isBuffering: true })

    case 'PLAY':
      return Object.assign({}, state, {
          isPlaying: true,
          isBuffering: false,
          video: action.data || video
        },
        action.skip ? { currentTime: 0, loaded: 0 } : {}
      )

    case 'PAUSE':
      return Object.assign({}, state, { isPlaying: false })

    case 'UPDATE_TIME':
      return Object.assign({}, state, {
        currentTime: action.currentTime,
        duration: action.duration || duration
      })

    case 'UPDATE_LOAD':
      return Object.assign({}, state, { loaded: action.loaded })

    case 'SCREEN_OPEN':
      return Object.assign({}, state, {
        showScreen: true,
        showQueue: false
      })

    case 'SCREEN_CLOSE':
      return Object.assign({}, state, { showScreen: false })


    case 'QUEUE_OPEN':
      return Object.assign({}, state, {
        showQueue: true,
        showScreen: false,
        newQueueItems: initialState.newQueueItems
      })

    case 'QUEUE_CLOSE':
      return Object.assign({}, state, { showQueue: false })

    case 'QUEUE_PUSH':
      return Object.assign({}, state, {
        queue: [...queue, action.data],
        newQueueItems: state.newQueueItems + 1
      })

    case 'QUEUE_PUSH_PLAYLIST':
      return Object.assign({}, state, {
        queue: [...queue, ...action.data],
        newQueueItems: state.newQueueItems + action.data.length
      })

    case 'QUEUE_REMOVE':

      return Object.assign({}, state, { queue: queue.filter((item, index) => index !== action.index) })

    case 'QUEUE_CLEAR':
      return Object.assign({}, state, { queue: action.currentVideo.videoId ? [action.currentVideo] : initialState.queue })

    case 'QUEUE_SET':
      return Object.assign({}, state, { queue: action.newQueue })

    case 'OPEN_VOLUME':
      return Object.assign({}, state, { showVolume: true })

    case 'CLOSE_VOLUME':
      return Object.assign({}, state, { showVolume: false })

    case 'SET_VOLUME':
      return Object.assign({}, state, {
        isMuted: false,
        volume: action.data
      })

    case 'MUTE':
      return Object.assign({}, state, { isMuted: true })

    case 'UNMUTE':
      return Object.assign({}, state, { isMuted: false })
  }

  return state
}
