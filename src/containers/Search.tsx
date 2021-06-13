import { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

    const [{ mountGrid }, setState] = useState({
        mountGrid: true
    });

    const handleSearchVideos = () => searchVideos(query);

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

    useEffect(() => {
        setState({ mountGrid: false });

        clearSearch();

        setTimeout(() => setState({ mountGrid: true }));

        return clearSearch;
    }, [query, forMine]);

    return query && mountGrid ? (
        totalResults === 0 ? (
            <Placeholder icon="list" text="No results found." />
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
                                onClickMenu={handleClickMenu(data, openMenu)}
                            />
                        )}
                    />
                )}
            </MenuWrapper>
        )
    ) : null;
};

export default Search;
