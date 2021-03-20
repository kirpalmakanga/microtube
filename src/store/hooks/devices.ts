import { useEffect } from 'react';

import { DeviceData, GenericObject } from '../../../@types/alltypes';
import { useStore } from '..';
import { subscribe, emit } from '../../lib/socket';

export const useDevices = () => {
    const [
        {
            user: { id: userId },
            app: { devices, deviceId }
        },
        dispatch
    ] = useStore();

    const connectLocalDevice = () => {
        const { appCodeName: deviceName } = navigator;

        emit('device:add', { deviceId, deviceName });
    };

    const subscribeToDevicesSync = () =>
        subscribe('devices:sync', (devices) =>
            dispatch({ type: 'app/UPDATE_DATA', payload: { devices } })
        );

    const setMasterDevice = (deviceId: string) => {
        const { deviceId: masterDeviceId } =
            devices.find(({ isMaster }: DeviceData) => isMaster) || {};

        if (deviceId !== masterDeviceId) {
            emit('device:active', deviceId);
        }
    };

    const synchronizePlayer = (data: GenericObject) =>
        emit('player:sync', data);

    const subscribeToPlayerSync = (callback: (response: any) => void) =>
        subscribe('player:sync', callback);

    const currentDevice = devices.find(
        ({ deviceId: id }: DeviceData) => id === deviceId
    ) || {
        isMaster: true
    };

    const availableDevices = devices.filter(
        ({ deviceId: id }: DeviceData) => id !== deviceId
    );

    useEffect(() => {
        subscribe('connect', () => {
            emit('room', userId);

            connectLocalDevice();
            subscribeToDevicesSync();
        });

        subscribe('disconnect', () => dispatch({ type: 'app/CLEAR_DEVICES' }));

        return () => emit('device:delete', deviceId);
    }, []);

    return {
        devices: [currentDevice, ...availableDevices],
        currentDevice,
        availableDevices,
        setMasterDevice,
        synchronizePlayer,
        subscribeToPlayerSync
    };
};
