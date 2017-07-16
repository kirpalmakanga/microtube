import DocumentTitle from 'react-document-title'
import formatTime from '../../../lib/formatTime'

const InfoTitle = ({ title, currentTime, duration }) => {
  let documentTitle = 'Youtube Lite'

  if (title) {
    documentTitle = [title, '-', formatTime(currentTime), '/', formatTime(duration)].join(' ')
  }

  return (
    <DocumentTitle title={documentTitle}>
      <div className='player__info-title'>{title}</div>
    </DocumentTitle>
  )
}

export default InfoTitle
