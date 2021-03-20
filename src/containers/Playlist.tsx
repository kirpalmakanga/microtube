import { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { usePlaylistItems } from '../store/hooks/playlist-items';

import List from '../components/List';
import Placeholder from '../components/Placeholder';
import VideoCard from '../components/cards/VideoCard';
import MenuWrapper from '../components/menu/MenuWrapper';
import { usePlayer } from '../store/hooks/player';
import { VideoData } from '../../@types/alltypes';
import { copyText, getVideoURL, isMobile, shareURL } from '../lib/helpers';
import { useNotifications } from '../store/hooks/notifications';

const Playlists = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();

    const [
        { items, totalResults },
        {
            getPlaylistTitle,
            getPlaylistItems,
            editPlaylistItem,
            removePlaylistItem,
            clearPlaylistItems
        }
    ] = usePlaylistItems(playlistId);

    const [, { queueItem }] = usePlayer();

    const [, { openNotification }] = useNotifications();

    const handleClickCard = useCallback(
        ({ id }: VideoData) => () => navigate(`/video/${id}`),
        []
    );

    const handleClickMenu = useCallback(
        (data: VideoData, callback: Function) => () => {
            const { title } = data;

            callback(data, title);
        },
        []
    );

    const handleSharing = ({ id, title }: VideoData) => {
        const url = getVideoURL(id);

        if (isMobile()) {
            shareURL({
                title,
                url
            });
        } else {
            copyText(url);

            openNotification('Copied link to clipboard.');
        }
    };

    useEffect(() => {
        getPlaylistTitle(playlistId);

        return clearPlaylistItems;
    }, [playlistId]);

    return totalResults === 0 ? (
        <Placeholder icon="list" text="This playlist is empty." />
    ) : (
        <MenuWrapper
            menuItems={[
                {
                    title: 'Add to queue',
                    icon: 'circle-add',
                    onClick: queueItem
                },
                {
                    title: 'Save to playlist',
                    icon: 'folder-add',
                    onClick: editPlaylistItem
                },
                {
                    title: 'Share',
                    icon: 'share',
                    onClick: handleSharing
                },
                {
                    title: 'Remove from playlist',
                    icon: 'delete',
                    onClick: removePlaylistItem
                }
            ]}
        >
            {(openMenu) => (
                <List
                    items={items}
                    itemKey={({ id }: VideoData) => id}
                    renderItem={(data: VideoData) => (
                        <VideoCard
                            {...data}
                            onClick={handleClickCard(data)}
                            onClickMenu={handleClickMenu(data, openMenu)}
                        />
                    )}
                    loadMoreItems={getPlaylistItems}
                />
            )}
        </MenuWrapper>
    );
};

export default Playlists;
