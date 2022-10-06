import { onCleanup, onMount, createMemo } from 'solid-js';
import { useLocation } from '@solidjs/router';
import { useStore } from '..';
import { subscribe, emit } from '../../lib/socket';
import { initialState } from './_state';

export const useAppTitle = () => {
    const location = useLocation();
    const [state] = useStore();

    const title = createMemo(() => {
        const { pathname } = location;
        const {
            channel: { channelTitle },
            playlistItems: { playlistTitle },
            player: {
                video: { title: videoTitle }
            }
        } = state;
        let title = 'MicroTube';

        if (pathname.startsWith('/subscriptions')) {
            title = 'Subscriptions';
        }

        if (pathname.startsWith('/channel') && channelTitle) {
            title = channelTitle;
        }

        if (pathname.startsWith('/playlist') && playlistTitle) {
            title = playlistTitle;
        }

        if (pathname.startsWith('/video') && videoTitle) {
            title = videoTitle;
        }

        return title;
    }, location.pathname);

    return title;
};

export const useDevices = () => {
    const [{ user: user, app: app }, setState] = useStore();

    const connectLocalDevice = () => {
        const { appCodeName: deviceName } = navigator;

        emit('device:add', { deviceId: app.deviceId, deviceName });
    };

    const subscribeToDevicesSync = () =>
        subscribe('devices:sync', (devices: DeviceData[]) =>
            setState('app', { devices })
        );

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
            ) ||
            ({
                isMaster: true
            } as DeviceData),
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
            setState('app', { devices: initialState().devices })
        );
    });

    onCleanup(() => emit('device:delete', app.deviceId));

    return {
        currentDevice,
        availableDevices,
        setMasterDevice,
        synchronizePlayer,
        subscribeToPlayerSync
    } as const;
};
