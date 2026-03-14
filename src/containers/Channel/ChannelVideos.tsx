import { createSignal, Show } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import Placeholder from '../../components/ui/Placeholder';
import { copyText, formatDate, getVideoURL, isMobile, shareURL } from '../../lib/helpers';
import { useChannel } from '../../store/channel';
import { useNotifications } from '../../store/notifications';
import { usePlayer } from '../../store/player';
import { usePlaylistItems } from '../../store/playlist-items';
import PlaylistSelectorModal from '../../components/playlist/PlaylistSelectorModal';
import Menu from '../../components/ui/Menu';

const ChannelVideos = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [channel, { getVideos }] = useChannel(params.channelId as string);
    const [, { editPlaylistItem }] = usePlaylistItems();
    const [, { queueItem }] = usePlayer();
    const [, { openNotification }] = useNotifications();

    function handleClickCard({ id }: VideoData) {
        return () => navigate(`/video/${id}`);
    }

    return (
        <Show
            when={channel.videos.totalResults === null || channel.videos.totalResults > 0}
            fallback={<Placeholder icon="list" text="This channel hasn't uploaded videos." />}
        >
            <List items={channel.videos.items} loadItems={getVideos}>
                {({ data }) => {
                    const [isPlaylistSelectorVisible, setIsPlaylistSelectorVisible] =
                        createSignal<boolean>(false);

                    function openPlaylistSelector() {
                        setIsPlaylistSelectorVisible(true);
                    }

                    function closePlaylistSelector() {
                        setIsPlaylistSelectorVisible(false);
                    }

                    function onSelectPlaylist(playlistData: PlaylistData) {
                        editPlaylistItem(data, playlistData);
                    }

                    const menuItems = [
                        {
                            title: `Add to queue`,
                            icon: 'circle-add',
                            onClick: () => queueItem(data)
                        },
                        {
                            title: `Save`,
                            icon: 'bookmark-outline',
                            onClick: openPlaylistSelector
                        },
                        {
                            title: 'Share',
                            icon: 'share',
                            onClick: () => {
                                const url = getVideoURL(data.id);

                                if (isMobile()) {
                                    shareURL({
                                        title: data.title,
                                        url
                                    });
                                } else {
                                    copyText(url);

                                    openNotification('Copied link to clipboard.');
                                }
                            }
                        }
                    ];

                    return (
                        <>
                            <Menu title={data.title} items={menuItems}>
                                {(openMenu) => (
                                    <ListItem
                                        {...data}
                                        subSubtitle={formatDate(data.publishedAt, 'MMMM do yyyy')}
                                        onClick={handleClickCard(data)}
                                        onClickMenu={openMenu}
                                    />
                                )}
                            </Menu>

                            <PlaylistSelectorModal
                                isVisible={isPlaylistSelectorVisible()}
                                onClickItem={onSelectPlaylist}
                                onClickClose={closePlaylistSelector}
                            />
                        </>
                    );
                }}
            </List>
        </Show>
    );
};

export default ChannelVideos;
