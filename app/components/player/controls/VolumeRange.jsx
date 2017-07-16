const VolumeRange = ({ value, onChange }) => (
  <div className='player__controls-volume-range'>
    <input type='range' min='0' max='100' value={value} onChange={onChange} />
  </div>
)

export default VolumeRange
