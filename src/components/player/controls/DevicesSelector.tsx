import { useState, FunctionComponent, useCallback } from 'react';

import Button from './Button';

interface Device {
    deviceId: string;
    deviceName: string;
    isMaster: boolean;
}

interface Props {
    devices: Device[];
    currentItem: Device;
    onClickItem: (deviceId: string) => void;
}

const DevicesSelector: FunctionComponent<Props> = ({
    devices = [],
    currentItem: { deviceId, deviceName, isMaster },
    onClickItem = () => {}
}) => {
    const [showItems, setShowItems] = useState(false);

    const handleClickItem = useCallback(
        (deviceId) => () => {
            setShowItems(false);

            onClickItem(deviceId);
        },
        []
    );

    const handleToggleItems = useCallback(() => setShowItems(!showItems), [
        showItems
    ]);

    return (
        <div className="player__controls-devices">
            <Button
                className={[
                    'player__controls-button icon-button',
                    showItems ? 'is-active' : ''
                ].join(' ')}
                icon="devices"
                ariaLabel="Devices"
                onClick={handleToggleItems}
            />

            <ul
                className="player__controls-devices-list"
                data-state={showItems ? 'open' : 'closed'}
            >
                <li className="device" onClick={handleClickItem(deviceId)}>
                    <span className="device__desc">Current device</span>
                    <span className="device__name">
                        {`${deviceName} ${isMaster ? '(active)' : ''}`}
                    </span>
                </li>

                {devices.map(({ deviceId, deviceName, isMaster }) => (
                    <li
                        key={deviceId}
                        className="device"
                        onClick={handleClickItem(deviceId)}
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
