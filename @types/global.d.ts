declare const SIZE_DEFAULT = 'default';
declare const SIZE_MEDIUM = 'medium';
declare const SIZE_HIGH = 'high';

export {};

interface File {
    url: string;
}

declare global {
    interface ThumbnailsData {
        [key: string]: File;
        [SIZE_DEFAULT]: File;
        [SIZE_MEDIUM]: File;
        [SIZE_HIGH]: File;
    }

    interface DeviceData {
        deviceId: string;
        deviceName: string;
        isMaster: boolean;
    }

    type GenericObject = { [key: string]: any };

    interface UserData {
        id: string;
        name: string;
        picture: string;
        accessToken: string;
        refreshToken: string;
        idToken: string;
    }

    interface PlaylistData {
        id: string;
        title: string;
        thumbnails: ThumbnailsData;
        itemCount: number;
        privacyStatus: string;
    }

    interface VideoData {
        id: string;
        title: string;
        description: string;
        thumbnails: ThumbnailsData;
        duration: number;
        publishedAt: string;
        channelId: string;
        channelTitle: string;
        privacyStatus: string;
    }

    interface PlaylistItemData extends VideoData {
        playlistId: string;
        playlistItemId: string;
    }

    interface ChannelData {
        id: string;
        title: string;
        thumbnails: ThumbnailsData;
    }

    interface PlayerSyncPayload {
        action: string;
        data: GenericObject;
    }

    interface PlayerSyncHandlers {
        [key: string]: Function;
    }

    interface ShareConfig {
        title: string;
        url: string;
    }

    type HTMLElementWheelEvent = Event & {
        deltaY: number;
    };

    type KeyboardEventName = 'keypress' | 'keydown' | 'keyup';
}
