import { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import List from '../../components/List';
import Placeholder from '../../components/Placeholder';
import VideoCard from '../../components/cards/VideoCard';

import MenuWrapper from '../../components/menu/MenuWrapper';
import { VideoData } from '../../../@types/alltypes';
import { useChannel } from '../../store/hooks/channel';
import { usePlaylistItems } from '../../store/hooks/playlist-items';
import { usePlayer } from '../../store/hooks/player';
import { useNotifications } from '../../store/hooks/notifications';
import { copyText, getVideoURL, isMobile, shareURL } from '../../lib/helpers';

const ChannelVideos = () => {
    const { channelId } = useParams();
    const navigate = useNavigate();

    const [{ items, totalResults }, { getChannelVideos, clearChannelVideos }] =
        useChannel(channelId);
    const [, { editPlaylistItem }] = usePlaylistItems();
    const [, { queueItem }] = usePlayer();
    const [, { openNotification }] = useNotifications();

    const handleGetChannelVideos = useCallback(
        () => getChannelVideos(channelId),
        []
    );

    const handleClickCard = useCallback(
        ({ id }: VideoData) =>
            () =>
                navigate(`/video/${id}`),
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

    useEffect(() => clearChannelVideos, []);

    return totalResults === 0 ? (
        <Placeholder icon="list" text="This channel hasn't uploaded videos." />
    ) : (
        <MenuWrapper
            menuItems={[
                {
                    title: `Add to queue`,
                    icon: 'circle-add',
                    onClick: queueItem
                },
                {
                    title: `Save to playlist`,
                    icon: 'folder-add',
                    onClick: editPlaylistItem
                },
                {
                    title: 'Share',
                    icon: 'share',
                    onClick: handleSharing
                }
            ]}
        >
            {(openMenu) => (
                <List
                    items={items}
                    loadMoreItems={handleGetChannelVideos}
                    itemSize={(containerHeight) => containerHeight / 5}
                    itemKey={({ id }: VideoData) => id}
                    renderItem={(data: VideoData) => (
                        <VideoCard
                            {...data}
                            onClick={handleClickCard(data)}
                            onClickMenu={handleClickMenu(data, openMenu)}
                        />
                    )}
                />
            )}
        </MenuWrapper>
    );
};

export default ChannelVideos;
