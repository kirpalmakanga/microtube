import { useEffect, useCallback} from 'react';
import { useStore } from '../index';
import useNotifications from './notifications';
import * as api from '../../api/youtube';

/* TODO: hook up usePlaylistItems, usePrompt, useNotifications */

const queuePlaylist = (id: string, play: boolean) => {}
const queueItems = (items: object[]) => {}
const setActiveQueueItem = (id: string) => {}
const prompt = (config: object, callback: Function) => {}

export default (channelId: string) => {
    const [{ playlists, player: { queue } }, dispatch] = useStore();
    const [, { openNotification, closeNotification }] = useNotifications();

    const { nextPageToken: pageToken, hasNextPage } = playlists;

    useEffect(() => dispatch({ type: 'playlists/CLEAR_ITEMS' }), []);

    return [playlists, {
        getPlaylists: useCallback(
            async () => {
                try {
                    if (!hasNextPage) {
                        return;
                    }
    
                    const payload = await api.getPlaylists({
                        ...(channelId ? { channelId } : { mine: true }),
                        pageToken
                    });
    
                    dispatch({ type: 'playlists/UPDATE_ITEMS', payload });
                } catch (error) {
                    dispatch(openNotification('Error fetching playlists.'))
                }
            },
            [channelId]
        ),
    
        clearPlaylists: useCallback(() => dispatch({ type: 'playlists/CLEAR_ITEMS' }), [
            channelId
        ]),

        createPlaylist : useCallback(async(params) => {
            const data = await api.createPlaylist(params);
        
            dispatch({ type: 'playlists/ADD_ITEM', data });
        
            return data;
        },[channelId]),
            
                removePlaylist: useCallback(
                    ({ id: playlistId, title }) => {
                            dispatch(
                                prompt(
                                    {
                                        promptText: `Remove ${title} ?`,
                                        confirmText: 'Remove'
                                    },
                                    () => {
                                        (async () => {
                                            try {
                                                await api.removePlaylist(playlistId);
                    
                                                dispatch({
                                                    type: 'playlists/REMOVE_ITEM',
                                                    data: { playlistId }
                                                });
                    
                                                dispatch(
                                                    openNotification(`Removed playlist "${title}".`)
                                                );
                                            } catch (error) {
                                                dispatch(
                                                    openNotification('Error deleting playlist.')
                                                );
                                            }
                                        })();
                                    }
                                )
                            );
                    },
                    [channelId]
                ),
    
        queuePlaylist: useCallback(
            async ({ id: playlistId }, play) => {        
                const getItems = async (pageToken: string) => {
                    const { items, nextPageToken } = await api.getPlaylistItems({
                        playlistId,
                        pageToken
                    });
        
                    const newItems = dispatch(queueItems(items));
        
                    if (play && !pageToken && newItems.length) {
                        const [{ id }] = newItems;
        
                        dispatch(setActiveQueueItem(id));
                    }
        
                    if (nextPageToken) {
                        await getItems(nextPageToken);
                    }
                };

                try {
                    await getItems(pageToken);
                } catch (error) {
                    
                    // dispatch(openNotification({ message: 'Error queueing playlist items.' }))
                }
            },
            [channelId]
        ),
    
       launchPlaylist:useCallback(
            ({ id }) => dispatch(queuePlaylist(id, true)),
            [channelId]
        ),
    }]
}
