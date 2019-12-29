import { PureComponent } from 'react';

class VolumeRange extends PureComponent {
    render() {
        const { value, onChange } = this.props;

        return (
            <div className="player__controls-volume-range">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={onChange}
                />
            </div>
        );
    }
}

export default VolumeRange;
