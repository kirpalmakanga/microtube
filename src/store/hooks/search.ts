import { useStore } from '..';
import * as api from '../../api/youtube';
import { omit } from '../../lib/helpers';
import { rootInitialState } from '../state';
import { useNotifications } from './notifications';

export const useSearch = () => {
    const [{ search }, setState] = useStore();
    const [, { openNotification }] = useNotifications();

    const setSearchTarget = (forMine: number) =>
        setState('search', {
            forMine
        });

    const clearSearch = () =>
        setState('search', omit(rootInitialState.search, 'forMine'));

    const searchVideos = async (query: string) => {
        try {
            const {
                items,
                hasNextPage,
                forMine,
                nextPageToken: pageToken
            } = search;

            if (!hasNextPage) {
                return;
            }

            const {
                items: newItems,
                nextPageToken = '',
                totalResults
            } = await api.searchVideos({
                query,
                forMine,
                pageToken
            });

            setState('search', {
                items: [...items, ...newItems],
                nextPageToken,
                hasNextPage: !!nextPageToken,
                totalResults
            });
        } catch (error) {
            openNotification('Error searching videos.');
        }
    };

    return [search, { searchVideos, setSearchTarget, clearSearch }];
};
