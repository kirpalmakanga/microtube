import { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { usePlaylistItems } from '../store/hooks/playlist-items';

import List from '../components/List';
import Placeholder from '../components/Placeholder';
import VideoCard from '../components/cards/VideoCard';
import MenuWrapper from '../components/menu/MenuWrapper';
import { usePlayer } from '../store/hooks/player';
import { VideoData } from '../../@types/alltypes';

const Playlists = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();

    const [
        { items, totalResults },
        {
            getPlaylistTitle,
            getPlaylistItems,
            editPlaylistItem,
            removePlaylistItem
        }
    ] = usePlaylistItems(playlistId);

    const [, { queueItem }] = usePlayer();

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
