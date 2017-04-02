import Player from './Player.jsx'
import Queue from './Queue.jsx'
import Screen from './Screen.jsx'

const PlayerContainer = () => (
  <div className='player__container'>
    <Queue />
    <Screen />
    <Player />
  </div>
)

export default PlayerContainer
