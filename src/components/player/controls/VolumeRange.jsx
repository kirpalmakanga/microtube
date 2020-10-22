import { preventDefault } from '../../../lib/helpers';

const VolumeRange = ({ value, onChange }) => {
    const handleUpdate = preventDefault(({ target: { value } }) =>
        onChange(value)
    );

    return (
        <div className="player__controls-volume-range">
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={handleUpdate}
            />
        </div>
    );
};

export default VolumeRange;
