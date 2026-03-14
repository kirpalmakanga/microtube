import { createEffect, createSignal, on, onCleanup, onMount, Show } from 'solid-js';
import { A, useNavigate, useSearchParams } from '@solidjs/router';
import List from '../components/List';
import ListItem from '../components/ListItem';
import Placeholder from '../components/ui/Placeholder';
import {
    copyText,
    formatDate,
    getVideoURL,
    isMobile,
    shareURL,
    stopPropagation
} from '../lib/helpers';
import { useNotifications } from '../store/notifications';
import { usePlayer } from '../store/player';
import { usePlaylistItems } from '../store/playlist-items';
import { useSearch } from '../store/search';
import Menu, { MenuItemData } from '../components/ui/Menu';
import PlaylistSelectorModal from '../components/playlist/PlaylistSelectorModal';

const Search = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [search, { searchVideos, clearSearch }] = useSearch();
    const [, { editPlaylistItem }] = usePlaylistItems();
    const [, { queueItem }] = usePlayer();
    const [, { openNotification }] = useNotifications();
    const [shouldMountList, setShouldMountList] = createSignal(false);

    function handleSearchVideos() {
        const { query } = searchParams;

        if (query) {
            searchVideos(query as string);
        }
    }

    function handleClickCard({ id }: VideoData) {
        return () => navigate(`/video/${id}`);
    }

    createEffect(
        on(
            [(): string => (searchParams.query as string) || '', (): number => search.forMine],
            (
                [query, forMine]: [string, number],
                [previousQuery, previousForMine]: [string, number] = ['', 0]
            ) => {
                if (query && (query !== previousQuery || forMine !== previousForMine)) {
                    setShouldMountList(false);

                    clearSearch();

                    requestAnimationFrame(() => setShouldMountList(true));
                }
                return [query, forMine];
            }
        )
    );

    onMount(() => {
        if (searchParams.query) setShouldMountList(true);
    });

    onCleanup(clearSearch);

    return (
        <Show
            when={searchParams.query && shouldMountList()}
            fallback={<div class="flex flex-column flex-fill"></div>}
        >
            <Show
                when={search.totalResults === null || search.totalResults > 0}
                fallback={<Placeholder icon="list" text="No results found." />}
            >
                <List items={search.items} loadItems={handleSearchVideos}>
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

                        function menuItems(videoData: VideoData): MenuItemData[] {
                            return [
                                {
                                    title: `Add to queue`,
                                    icon: 'circle-add',
                                    onClick: () => queueItem(videoData)
                                },
                                {
                                    title: `Save`,
                                    icon: 'bookmark-outline',
                                    onClick: () => openPlaylistSelector()
                                },
                                {
                                    title: 'Share',
                                    icon: 'share',
                                    onClick: () => {
                                        const url = getVideoURL(videoData.id);

                                        if (isMobile()) {
                                            shareURL({
                                                title: videoData.title,
                                                url
                                            });
                                        } else {
                                            copyText(url);

                                            openNotification('Copied link to clipboard.');
                                        }
                                    }
                                }
                            ];
                        }

                        return (
                            <>
                                <Menu title={data.title} items={menuItems(data)}>
                                    {(openMenu) => (
                                        <ListItem
                                            {...data}
                                            subtitle={
                                                <A
                                                    href={`/channel/${data.channelId}`}
                                                    onClick={stopPropagation()}
                                                >
                                                    {data.channelTitle}
                                                </A>
                                            }
                                            subSubtitle={formatDate(
                                                data.publishedAt,
                                                'MMMM do yyyy'
                                            )}
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
        </Show>
    );
};

export default Search;
