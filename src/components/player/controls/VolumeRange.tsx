import { Component, JSX } from 'solid-js';

interface Props {
    value: number;
    onChange: (value: number) => void;
}

const VolumeRange: Component<Props> = (props) => {
    const handleUpdate: JSX.EventHandler<HTMLInputElement, Event> = ({
        currentTarget: { value }
    }) => props.onChange(parseInt(value));

    return (
        <div class="bg-primary-900 px-4 py-3">
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
