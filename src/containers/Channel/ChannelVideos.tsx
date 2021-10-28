import { Show } from 'solid-js';
import { useNavigate, useParams } from 'solid-app-router';

import List from '../../components/List';
import Placeholder from '../../components/Placeholder';
import VideoCard from '../../components/cards/VideoCard';

import { VideoData } from '../../../@types/alltypes';
import { useChannel } from '../../store/hooks/channel';
import { usePlaylistItems } from '../../store/hooks/playlist-items';
import { usePlayer } from '../../store/hooks/player';
import { useNotifications } from '../../store/hooks/notifications';
import { copyText, getVideoURL, isMobile, shareURL } from '../../lib/helpers';
import { useMenu } from '../../store/hooks/menu';

const ChannelVideos = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [channel, { getVideos }] = useChannel(params.channelId);
    const [, { editPlaylistItem }] = usePlaylistItems();
    const [, { queueItem }] = usePlayer();
    const [, { openNotification }] = useNotifications();
    const [, { openMenu }] = useMenu();

    const handleGetChannelVideos = () => getVideos(params.channelId);

    const handleClickCard =
        ({ id }: VideoData) =>
        () =>
            navigate(`/video/${id}`);

    const handleClickMenu = (callbackData: VideoData) => () => {
        const { title } = callbackData;

        openMenu({
            title,
            callbackData,
            items: [
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
                    onClick: ({ id, title }: VideoData) => {
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
                    }
                }
            ]
        });
    };

    return (
        <Show
            when={
                channel.videos.totalResults === null ||
                channel.videos.totalResults > 0
            }
            fallback={
                <Placeholder
                    icon="list"
                    text="This channel hasn't uploaded videos."
                />
            }
        >
            <List
                items={channel.videos.items}
                loadItems={handleGetChannelVideos}
            >
                {({ data }) => (
                    <VideoCard
                        {...data}
                        onClick={handleClickCard(data)}
                        onClickMenu={handleClickMenu(data)}
                    />
                )}
            </List>
        </Show>
    );
};

export default ChannelVideos;
