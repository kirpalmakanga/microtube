import { useNavigate, useSearchParams } from 'solid-app-router';
import {
    createEffect,
    createSignal,
    on,
    onCleanup,
    onMount,
    Show
} from 'solid-js';
import { VideoData } from '../../@types/alltypes';
import VideoCard from '../components/cards/VideoCard';
import List from '../components/List';
import Placeholder from '../components/Placeholder';
import { copyText, getVideoURL, isMobile, shareURL } from '../lib/helpers';
import { useMenu } from '../store/hooks/menu';
import { useNotifications } from '../store/hooks/notifications';
import { usePlayer } from '../store/hooks/player';
import { usePlaylistItems } from '../store/hooks/playlist-items';
import { useSearch } from '../store/hooks/search';

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
            (input, previousInput) => {
                const [previousQuery, previousForMine] = previousInput || [];
                const [query, forMine] = input;

                if (
                    query &&
                    (query !== previousQuery || forMine !== previousForMine)
                ) {
                    setShouldMountList(false);
                    clearSearch();
                    requestAnimationFrame(() => setShouldMountList(true));
                }
                return input;
            }
        )
    );

    onMount(() => {
        if (searchParams.query) setShouldMountList(true);
    });

    onCleanup(clearSearch);

    return (
        <Show when={searchParams.query && shouldMountList()}>
            <Show
                when={search.totalResults === null || search.totalResults > 0}
                fallback={<Placeholder icon="list" text="No results found." />}
            >
                <List items={search.items} loadItems={handleSearchVideos}>
                    {({ data }) => (
                        <VideoCard
                            {...data}
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
