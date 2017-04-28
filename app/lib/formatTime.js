export default function formatTime(time) {
  let hours, minutes, seconds = 0

  hours = Math.floor(time / 3600) % 24

  time  = time - hours * 3600

  minutes = Math.floor(time / 60) % 60

  time  = time - minutes * 60

  seconds = Math.floor(time)

  return [hours, minutes, seconds].map(t => ('0' + t).slice(-2)).join(':')
}
