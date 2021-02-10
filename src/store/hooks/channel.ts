import * as api from '../../api/youtube';

import { useStore } from '..';
import { useNotifications } from './notifications';
import { Action, Dispatch, GetState } from '../helpers';
import { useEffect } from 'react';

export const useChannel = (channelId: string) => {
    const [{ channel }, dispatch] = useStore();
    const [, { openNotification }] = useNotifications();

    const getChannel = async () => {
        try {
            const data = await api.getChannel(channelId);

            dispatch({ type: 'channel/UPDATE_DATA', data });
        } catch (error) {
            openNotification('Error fetching channel data.');
        }
    };

    const clearChannelData = () => dispatch({ type: 'channel/CLEAR_DATA' });

    const getChannelVideos = () =>
        dispatch(async (dispatch: Dispatch<Action>, getState: GetState) => {
            try {
                const {
                    channel: { nextPageToken: pageToken, hasNextPage }
                } = getState();

                if (!hasNextPage) {
                    return;
                }

                const payload = await api.getChannelVideos({
                    channelId,
                    pageToken
                });

                dispatch({ type: 'channel/UPDATE_ITEMS', payload });
            } catch (error) {
                openNotification('Error fetching channel videos.');
            }
        });

    const clearChannelVideos = () => dispatch({ type: 'channel/CLEAR_ITEMS' });

    return [
        channel,
        { getChannel, clearChannelData, getChannelVideos, clearChannelVideos }
    ];
};
