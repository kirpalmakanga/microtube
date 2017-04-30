exports.setActiveQueueItem = ({ queue, video, index }) => {
  return dispatch => {
    if (video) {
      index = queue.length
      queue.push(video)
    }
    dispatch({
      type: 'QUEUE_SET',
      data: queue.map((v, i) => {
        v.active = false

        if(i === index) {
          v.active = true
        }
        return v
      })
    })
  }
}
