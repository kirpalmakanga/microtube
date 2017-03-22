import Player from './Player'
import Queue from './Queue'
import Screen from './Screen'

const PlayerContainer = () => (
  <div className='player__container'>
    <Queue />
    <Screen />
    <Player />
  </div>
)

export default PlayerContainer
