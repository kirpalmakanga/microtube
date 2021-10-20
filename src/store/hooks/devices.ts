import { onCleanup, onMount, createMemo } from 'solid-js';
import { DeviceData, GenericObject } from '../../../@types/alltypes';
import { useStore } from '..';
import { subscribe, emit } from '../../lib/socket';
import { rootInitialState } from '../reducers';

export const useDevices = () => {
    const [{ user: user, app: app }, setState] = useStore();

    const connectLocalDevice = () => {
        const { appCodeName: deviceName } = navigator;

        emit('device:add', { deviceId: app.deviceId, deviceName });
    };

    const subscribeToDevicesSync = () =>
        subscribe('devices:sync', (devices) => setState('app', { devices }));

    const setMasterDevice = (deviceId: string) => {
        const { deviceId: masterDeviceId } =
            app.devices.find(({ isMaster }: DeviceData) => isMaster) || {};

        if (deviceId !== masterDeviceId) {
            emit('device:active', deviceId);
        }
    };

    const synchronizePlayer = (data: GenericObject) =>
        emit('player:sync', data);

    const subscribeToPlayerSync = (callback: (response: any) => void) =>
        subscribe('player:sync', callback);

    const currentDevice = createMemo(
        () =>
            app.devices.find(
                ({ deviceId: id }: DeviceData) => id === app.deviceId
            ) || {
                isMaster: true
            },
        app.deviceId
    );

    const availableDevices = createMemo(
        () =>
            app.devices.filter(
                ({ deviceId: id }: DeviceData) => id !== app.deviceId
            ),
        app.deviceId
    );

    onMount(() => {
        subscribe('connect', () => {
            emit('room', user.id);

            connectLocalDevice();
            subscribeToDevicesSync();
        });

        subscribe('disconnect', () =>
            setState('app', { devices: rootInitialState.app.devices })
        );
    });

    onCleanup(() => emit('device:delete', app.deviceId));

    return {
        currentDevice,
        availableDevices,
        setMasterDevice,
        synchronizePlayer,
        subscribeToPlayerSync
    };
};
