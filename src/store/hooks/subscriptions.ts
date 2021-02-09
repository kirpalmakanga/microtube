import * as api from '../../api/youtube';

import { useStore } from '..';
import { useNotifications } from './notifications';
import { usePrompt } from './prompt';
import { Action, Dispatch, GetState } from '../helpers';

export const useSubscriptions = () => {
    const [{ subscriptions }, dispatch] = useStore();
    const [, { openNotification }] = useNotifications();
    const [, { openPrompt }] = usePrompt();

    const getSubscriptions = (channelId: string) =>
        dispatch(async (dispatch: Dispatch<Action>, getState: GetState) => {
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
                console.log(error);
                openNotification('Error fetching subscriptions.');
            }
        });

    const subscribeToChannel = async (channelId: string) => {
        try {
            await api.subscribeToChannel(channelId);

            dispatch({
                type: 'subscriptions/SUBSCRIBE',
                payload: { channelId }
            });
        } catch (error) {
            openNotification('Error subscribing to channel.');
        }
    };

    const unsubscribeFromChannel = async (
        subscriptionId: string,
        channelTitle: string
    ) => {
        openPrompt({
            headerText: `Unsubscribe from ${channelTitle}`,
            confirmText: 'OK',
            cancelText: 'Cancel',
            callback: async () => {
                try {
                    dispatch({
                        type: 'subscriptions/UNSUBSCRIBE',
                        payload: { subscriptionId }
                    });

                    await api.unsubscribeFromChannel(subscriptionId);
                } catch (error) {
                    openNotification('Error unsubscribing to channel.');
                }
            }
        });
    };

    return [
        subscriptions,
        { getSubscriptions, subscribeToChannel, unsubscribeFromChannel }
    ];
};
