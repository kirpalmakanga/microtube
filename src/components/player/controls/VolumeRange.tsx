import { FunctionComponent, SyntheticEvent, useCallback } from 'react';

interface Props {
    value: number;
    onChange: (value: number) => void;
}

const VolumeRange: FunctionComponent<Props> = ({ value, onChange }) => {
    const handleUpdate = ({
        currentTarget: { value }
    }: SyntheticEvent<HTMLInputElement>) => onChange(parseInt(value));

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
