import Controls from '../player/Controls.jsx'
import Queue from '../player/Queue.jsx'
import Screen from '../player/Screen.jsx'

const Player = () => (
  <div className='player__container'>
    <Queue />
    <Screen />
    <Controls />
  </div>
)

export default Player
