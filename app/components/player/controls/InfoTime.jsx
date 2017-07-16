import formatTime from '../../../lib/formatTime'

const InfoTime = ({ currentTime, duration }) => {
  return (
    <div className='player__info-time'>
      <span>{formatTime(currentTime)}</span>
      <span className="separator">/</span>
      <span>{formatTime(duration)}</span>
    </div>
  )
}

export default InfoTime
