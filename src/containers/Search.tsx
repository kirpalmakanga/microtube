import {
    createEffect,
    createSignal,
    on,
    onCleanup,
    onMount,
    Show
} from 'solid-js';
import { NavLink, useNavigate, useSearchParams } from '@solidjs/router';
import List from '../components/List';
import ListItem from '../components/ListItem';
import Placeholder from '../components/Placeholder';
import {
    copyText,
    formatDate,
    getVideoURL,
    isMobile,
    shareURL,
    stopPropagation
} from '../lib/helpers';
import { useMenu } from '../store/menu';
import { useNotifications } from '../store/notifications';
import { usePlayer } from '../store/player';
import { usePlaylistItems } from '../store/playlist-items';
import { useSearch } from '../store/search';

const Search = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [search, { searchVideos, clearSearch }] = useSearch();
    const [, { editPlaylistItem }] = usePlaylistItems();
    const [, { queueItem }] = usePlayer();
    const [, { openMenu }] = useMenu();
    const [, { openNotification }] = useNotifications();
    const [shouldMountList, setShouldMountList] = createSignal(false);
    const handleSearchVideos = () => searchVideos(searchParams.query);
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

    createEffect(
        on(
            [
                (): string => searchParams.query || '',
                (): number => search.forMine
            ],
            (
                [query, forMine]: [string, number],
                [previousQuery, previousForMine]: [string, number] = ['', 0]
            ) => {
                if (
                    query &&
                    (query !== previousQuery || forMine !== previousForMine)
                ) {
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
                    {({ data }) => (
                        <ListItem
                            {...data}
                            subtitle={
                                <NavLink
                                    href={`/channel/${data.channelId}`}
                                    onClick={stopPropagation()}
                                >
                                    {data.channelTitle}
                                </NavLink>
                            }
                            subSubtitle={formatDate(
                                data.publishedAt,
                                'MMMM do yyyy'
                            )}
                            onClick={handleClickCard(data)}
                            onClickMenu={handleClickMenu(data)}
                        />
                    )}
                </List>
            </Show>
        </Show>
    );
};

export default Search;
