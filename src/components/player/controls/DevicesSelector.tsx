import { FunctionComponent } from 'react';

import { DeviceData } from '../../../../@types/alltypes';

import TranslateY from '../../animations/TranslateY';
interface Props {
    isVisible: boolean;
    devices: DeviceData[];
    currentDevice: DeviceData;
    onClickItem: (deviceId: string) => void;
}

const DevicesSelector: FunctionComponent<Props> = ({
    isVisible,
    devices,
    currentDevice: { deviceId, deviceName, isMaster },
    onClickItem
}) => {
    const handleClickItem = (deviceId: string) => () => onClickItem(deviceId);

    return (
        <TranslateY in={isVisible} className="player__controls-devices">
            <ul className="player__controls-devices-list">
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
        </TranslateY>
    );
};

export default DevicesSelector;
