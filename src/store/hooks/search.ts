import { useStore } from '..';
import * as api from '../../api/youtube';
import { omit } from '../../lib/helpers';
import { GetState } from '../helpers';
import { rootInitialState } from '../reducers';
import { useNotifications } from './notifications';

export const useSearch = () => {
    const [{ search }, setState] = useStore();
    const [, { openNotification }] = useNotifications();

    const searchVideos = async (query: string) => {
        try {
            const { hasNextPage, forMine, nextPageToken: pageToken } = search;

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
                ...search,
                items: [...search.items, ...newItems],
                nextPageToken,
                hasNextPage: !!nextPageToken,
                totalResults
            });
        } catch (error) {
            openNotification('Error searching videos.');
        }
    };

    const setSearchTarget = (forMine: number) =>
        setState('search', {
            forMine
        });

    const clearSearch = () =>
        setState('search', omit(rootInitialState.search, ['forMine']));

    return [search, { searchVideos, setSearchTarget, clearSearch }];
};
