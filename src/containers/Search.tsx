import { Show, createEffect, createSignal, on, onCleanup } from 'solid-js';
import { useParams, useNavigate } from 'solid-app-router';

import { VideoData } from '../../@types/alltypes';

import { useSearch } from '../store/hooks/search';
import { usePlaylistItems } from '../store/hooks/playlist-items';
import { usePlayer } from '../store/hooks/player';

import List from '../components/List';
import VideoCard from '../components/cards/VideoCard';
import Placeholder from '../components/Placeholder';
import MenuWrapper from '../components/menu/MenuWrapper';

const Search = () => {
    const navigate = useNavigate();
    const { query } = useParams();
    const [{ items, totalResults, forMine }, { searchVideos, clearSearch }] =
        useSearch();
    const [, { editPlaylistItem }] = usePlaylistItems();
    const [, { queueItem }] = usePlayer();

    const [shouldMountGrid, setShouldMountGrid] = createSignal(true);

    const handleSearchVideos = () => searchVideos(query);

    const handleClickCard =
        ({ id }: VideoData) =>
        () =>
            navigate(`/video/${id}`);

    const handleClickMenu = (data: VideoData, callback: Function) => () => {
        const { title } = data;

        callback(data, title);
    };

    createEffect(
        on([query, forMine], () => {
            setShouldMountGrid(false);

            clearSearch();

            setTimeout(() => setShouldMountGrid(true));
        })
    );

    onCleanup(clearSearch);

    return (
        <Show when={query && shouldMountGrid()}>
            <Show
                when={totalResults === 0}
                fallback={<Placeholder icon="list" text="No results found." />}
            >
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
                        }
                    ]}
                >
                    {(openMenu) => (
                        <List
                            items={items}
                            itemKey={({ id }: VideoData) => id}
                            loadMoreItems={handleSearchVideos}
                            renderItem={(data: VideoData) => (
                                <VideoCard
                                    {...data}
                                    onClick={handleClickCard(data)}
                                    onClickMenu={handleClickMenu(
                                        data,
                                        openMenu
                                    )}
                                />
                            )}
                        />
                    )}
                </MenuWrapper>
            </Show>
        </Show>
    );
};

export default Search;
