import * as api from '../../api/youtube';

import { useStore } from '..';
import { useNotifications } from './notifications';
import { Action, Dispatch, GetState } from '../helpers';

export const useSubscriptions = () => {
    const [{ subscriptions }, dispatch] = useStore();
    const [, { openNotification }] = useNotifications();

    const getSubscriptions = (channelId: string) =>
        dispatch(async (getState: GetState) => {
            try {
                const {
                    subscriptions: { nextPageToken: pageToken, hasNextPage }
                } = getState();

                if (!hasNextPage) {
                    return;
                }

                const payload = await api.getSubscriptions({
                    pageToken,
                    ...(channelId ? { channelId } : { mine: true })
                });

                dispatch({
                    type: 'subscriptions/UPDATE_ITEMS',
                    payload
                });
            } catch (error) {
                openNotification('Error fetching subscriptions.');
            }
        });

    return [subscriptions, { getSubscriptions }];
};
