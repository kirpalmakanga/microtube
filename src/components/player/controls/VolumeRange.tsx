import { Component } from 'solid-js';
import { HTMLElementEvent } from '../../../../@types/alltypes';

interface Props {
    value: number;
    onChange: (value: number) => void;
}

const VolumeRange: Component<Props> = (props) => {
    const handleUpdate = ({
        currentTarget: { value }
    }: HTMLElementEvent<HTMLInputElement>) => props.onChange(parseInt(value));

    return (
        <div className="player__controls-volume-range">
            <input
                type="range"
                min="0"
                max="100"
                value={props.value}
                onChange={handleUpdate}
            />
        </div>
    );
};

export default VolumeRange;
