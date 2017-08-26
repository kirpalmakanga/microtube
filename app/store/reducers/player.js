const initialState = {
  queue: [],
  showQueue: false,
  showScreen: false,
  // volume: 100,
  // autoplay: 0,
  newQueueItems: 0
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case 'SCREEN_OPEN':
      return {
        ...state,
        showScreen: true,
        showQueue: false
      }

    case 'SCREEN_CLOSE':
     return {
       ...state,
       showScreen: false
     }

    case 'QUEUE_OPEN':
      return {
        ...state,
        showQueue: true,
        showScreen: false,
        newQueueItems: 0
      }

    case 'QUEUE_CLOSE':
      return {
        ...state,
        showQueue: false
      }

    case 'QUEUE_PUSH':
      return {
        ...state,
        queue: [...state.queue, ...data],
        newQueueItems: state.newQueueItems += data.length
      }

    case 'QUEUE_REMOVE':
      return {
        ...state,
        queue: state.queue.filter((item, i) => i !== data)
      }

    case 'QUEUE_CLEAR':
      return {
        ...state,
        queue: state.queue.filter(v => v.active)
      }

    case 'QUEUE_SET':
      return {
        ...state,
        queue: data
      }

    case 'QUEUE_SET_ACTIVE_ITEM':
      const { queue } = state
      let { video, index } = data

      if (video) {
        index = queue.length
        queue.push(video)
      }

      return {
        ...state,
        queue: queue.map((v, i) => ({ ...v, active: i === index ? true : false }))
      }
  }
  return state
}
