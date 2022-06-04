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
        <div class="player__controls-devices shadow--2dp">
            <ul class="player__controls-devices-list">
                <li
                    class="device"
                    onClick={handleClickItem(props.currentDevice.deviceId)}
                >
                    <span class="device__desc">Current device</span>
                    <span class="device__name">
                        {`${props.currentDevice.deviceName} ${
                            props.currentDevice.isMaster ? '(active)' : ''
                        }`}
                    </span>
                </li>

                <For each={props.devices}>
                    {({ deviceId, deviceName, isMaster }) => (
                        <li class="device" onClick={handleClickItem(deviceId)}>
                            <span class="device__desc">Browser</span>
                            <span class="device__name">
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
