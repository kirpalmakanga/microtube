import { useState } from 'react';

import Button from '../controls/Button';

const DevicesSelector = ({
    devices = [],
    currentItem = {},
    onClickItem = () => {}
}) => {
    const [showItems, setShowItems] = useState(false);
    const { deviceId, deviceName, isMaster } = currentItem;

    return (
        <div className="player__controls-devices">
            <Button
                className={[
                    'player__controls-button icon-button',
                    showItems ? 'is-active' : ''
                ].join(' ')}
                icon="devices"
                ariaLabel="Devices"
                onClick={() => setShowItems(!showItems)}
            />

            <ul
                className="player__controls-devices-list"
                data-state={showItems ? 'open' : 'closed'}
            >
                <li className="device" onClick={() => onClickItem(deviceId)}>
                    <span className="device__desc">Current device</span>
                    <span className="device__name">
                        {`${deviceName} ${isMaster ? '(active)' : ''}`}
                    </span>
                </li>

                {devices.map(({ deviceId, deviceName, isMaster }, index) => (
                    <li
                        key={index}
                        className="device"
                        onClick={() => onClickItem(deviceId)}
                    >
                        <span className="device__desc">Browser</span>
                        <span className="device__name">
                            {`${deviceName} ${isMaster ? '(active)' : ''}`}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DevicesSelector;
