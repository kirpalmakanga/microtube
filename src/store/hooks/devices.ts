import { useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './auth';
import { useMergedState, useSocket } from '../../lib/hooks';

import { SOCKET_URL } from '../../config/app';
import { DeviceData, GenericObject } from '../../../@types/alltypes';

export const useDevices = () => {
    const [{ id: userId }] = useAuth();
    const [{ localDeviceId, devices }, setState] = useMergedState({
        localDeviceId: uuidv4(),
        devices: []
    });
    const { subscribe, emit } = useSocket(SOCKET_URL);

    const connectLocalDevice = () => {
        const { appCodeName: deviceName } = navigator;

        emit('device:add', { deviceId: localDeviceId, deviceName });
    };

    const subscribeToDevicesSync = () =>
        subscribe('devices:sync', (devices) => setState({ devices }));

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

    const availableDevices = devices.filter(
        ({ deviceId: id }: DeviceData) => id !== localDeviceId
    );
    const currentDevice = devices.find(
        ({ deviceId: id }: DeviceData) => id === localDeviceId
    ) || {
        isMaster: true
    };

    useEffect(() => {
        subscribe('connect', () => {
            emit('room', userId);

            subscribe('disconnect', () => setState({ devices: [] }));

            connectLocalDevice();
            subscribeToDevicesSync();
        });

        return () => emit('device:delete', localDeviceId);
    }, []);

    return {
        currentDevice,
        availableDevices,
        setMasterDevice,
        synchronizePlayer,
        subscribeToPlayerSync
    };
};
