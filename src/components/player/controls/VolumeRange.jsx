import { PureComponent } from 'react';
import { preventDefault } from '../../../lib/helpers';

class VolumeRange extends PureComponent {
    handleUpdate = preventDefault(({ target: { value } }) => {
        const { onChange } = this.props;

        onChange(value);
    });

    render() {
        const {
            props: { value },
            handleUpdate
        } = this;

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
    }
}

export default VolumeRange;
