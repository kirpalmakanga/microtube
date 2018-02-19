import { h } from 'preact'

const formatPercent = (progress) => parseFloat((progress * 100) - 100).toFixed(2)

const InfoProgress = ({ percentElapsed, percentLoaded}) => {
  return (
    <div className='player__info-progress'>
      <div className='player__info-progress-gutter'>
        <div
          className='player__info-progress-loaded'
          style={{ transform: 'translateX(' + formatPercent(percentLoaded) + '%)' }}
        ></div>
        <div
          className='player__info-progress-played'
          style={{ transform: 'translateX(' + formatPercent(percentElapsed) + '%)' }}
        ></div>
      </div>
    </div>
  )
}

export default InfoProgress
