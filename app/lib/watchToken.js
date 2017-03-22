import moment from 'moment'

export default function watchToken(expires, callback) {
  const interval = setInterval(() => {
    if (moment().isSame(expires) || moment().isAfter(expires)) {
      console.log('clear')
      clearInterval(interval)
      callback()
    } else {
      console.log('watching')
    }
  }, 1000)
  return interval
}
