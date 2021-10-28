import { Show, createEffect, createSignal, on, onCleanup } from 'solid-js';
import { useParams, useNavigate } from 'solid-app-router';

import { VideoData } from '../../@types/alltypes';

import { useSearch } from '../store/hooks/search';
import { usePlaylistItems } from '../store/hooks/playlist-items';
import { usePlayer } from '../store/hooks/player';
import { useMenu } from '../store/hooks/menu';

import List from '../components/List';
import VideoCard from '../components/cards/VideoCard';
import Placeholder from '../components/Placeholder';
const Search = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [search, { searchVideos, clearSearch }] = useSearch();
    const [, { editPlaylistItem }] = usePlaylistItems();
    const [, { queueItem }] = usePlayer();
    const [, { openMenu }] = useMenu();
    const [shouldMountGrid, setShouldMountGrid] = createSignal(true);
    const handleSearchVideos = () => searchVideos(params.query);
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
                }
            ]
        });
    };

    createEffect(
        on(
            [
                (): string => decodeURIComponent(params.query || ''),
                (): number => search.forMine
            ],
            (input, previousInput) => {
                const [previousQuery] = previousInput || [];
                const [query] = input;

                if (query && query !== previousQuery) {
                    setShouldMountGrid(false);
                    clearSearch();
                    setTimeout(() => setShouldMountGrid(true));
                }
                return input;
            },
            { defer: true }
        )
    );

    onCleanup(clearSearch);

    return (
        <Show when={params.query && shouldMountGrid()}>
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
