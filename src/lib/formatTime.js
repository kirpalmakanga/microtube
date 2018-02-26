export default function formatTime(time, { displayHours = true } = {}) {
    let hours,
        minutes,
        seconds = 0

    hours = Math.floor(time / 3600) % 24

    time = time - hours * 3600

    minutes = Math.floor(time / 60) % 60

    time = time - minutes * 60

    seconds = Math.floor(time)

    const units = [minutes, seconds]

    if (displayHours) {
        units.unshift(hours)
    }

    return units.map((t) => ('0' + t).slice(-2)).join(':')
}
