import { Component, For } from 'solid-js';
interface Props {
    devices: DeviceData[];
    currentDevice: DeviceData;
    onClickItem: (deviceId: string) => void;
}

const DevicesSelector: Component<Props> = (props) => {
    const handleClickItem = (deviceId: string) => () =>
        props.onClickItem(deviceId);

    return (
        <div class="absolute bottom-12 left-0 right-0 shadow">
            <ul class="player__controls-devices-list">
                <li
                    class="flex flex-col bg-primary-800 hover:bg-primary-700 transition-colors font-montserrat px-4 py-2 cursor-pointer"
                    onClick={handleClickItem(props.currentDevice.deviceId)}
                >
                    <span class="text-light-50">Current device</span>
                    <span class="text-sm text-light-50 text-opacity-50">
                        {`${props.currentDevice.deviceName} ${
                            props.currentDevice.isMaster ? '(active)' : ''
                        }`}
                    </span>
                </li>

                <For each={props.devices}>
                    {({ deviceId, deviceName, isMaster }) => (
                        <li
                            class="flex flex-col bg-primary-800 hover:bg-primary-700 transition-colors font-montserrat px-4 py-2 cursor-pointer"
                            onClick={handleClickItem(deviceId)}
                        >
                            <span class="text-light-50">Browser</span>
                            <span class="text-sm text-light-50 text-opacity-50">
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
