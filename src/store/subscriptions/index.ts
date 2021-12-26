import * as api from '../../api/youtube';

import { useStore } from '..';
import { useNotifications } from '../notifications';
import { initialState } from './_state';

export const useSubscriptions = () => {
    const [{ subscriptions }, setState] = useStore();
    const [, { openNotification }] = useNotifications();

    const getData = async (channelId: string) => {
        try {
            const {
                items,
                nextPageToken: pageToken,
                hasNextPage
            } = subscriptions;

            if (!hasNextPage) {
                return;
            }

            const {
                items: newItems,
                nextPageToken = '',
                totalResults
            } = await api.getSubscriptions({
                pageToken,
                ...(channelId ? { channelId } : { mine: true })
            });

            setState('subscriptions', {
                items: [...items, ...newItems],
                nextPageToken,
                hasNextPage: !!nextPageToken,
                totalResults
            });
        } catch (error) {
            openNotification('Error fetching subscriptions.');
        }
    };

    const clearData = () => setState('subscriptions', initialState());

    return [subscriptions, { getData, clearData }];
};
