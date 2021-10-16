import { Component, For } from 'solid-js';
import { DeviceData } from '../../../../@types/alltypes';
interface Props {
    devices: DeviceData[];
    currentDevice: DeviceData;
    onClickItem: (deviceId: string) => void;
}

const DevicesSelector: Component<Props> = (props) => {
    const handleClickItem = (deviceId: string) => () =>
        props.onClickItem(deviceId);

    return (
        <div className="player__controls-devices">
            <ul className="player__controls-devices-list">
                <li
                    className="device"
                    onClick={handleClickItem(props.currentDevice.deviceId)}
                >
                    <span className="device__desc">Current device</span>
                    <span className="device__name">
                        {`${props.currentDevice.deviceName} ${
                            props.currentDevice.isMaster ? '(active)' : ''
                        }`}
                    </span>
                </li>

                <For each={props.devices}>
                    {({ deviceId, deviceName, isMaster }) => (
                        <li
                            className="device"
                            onClick={handleClickItem(deviceId)}
                        >
                            <span className="device__desc">Browser</span>
                            <span className="device__name">
                                {`${deviceName} ${isMaster ? '(active)' : ''}`}
                            </span>
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
};

export default DevicesSelector;
