import { useEffect } from 'react';
import { useStore } from '..';
import * as api from '../../api/youtube';
import { Action, Dispatch, GetState } from '../helpers';
import { useNotifications } from './notifications';

export const useSearch = () => {
    const [{ search }, dispatch] = useStore();
    const [, { openNotification }] = useNotifications();

    const searchVideos = (query: string) =>
        dispatch(async (getState: GetState) => {
            try {
                const {
                    search: { hasNextPage, forMine, nextPageToken: pageToken }
                } = getState();

                if (!hasNextPage) {
                    return;
                }

                const payload = await api.searchVideos({
                    query,
                    forMine,
                    pageToken
                });

                dispatch({ type: 'search/UPDATE_ITEMS', payload });
            } catch (error) {
                openNotification('Error searching videos.');
            }
        });

    const setSearchTarget = (forMine: number) =>
        dispatch({
            type: 'search/SET_TARGET',
            payload: {
                forMine
            }
        });

    const clearSearch = () => dispatch({ type: 'search/RESET' });

    return [search, { searchVideos, setSearchTarget, clearSearch }];
};
