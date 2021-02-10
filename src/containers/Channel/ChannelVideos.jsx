import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getChannelVideos,
    clearChannelVideos,
    queueItem,
    editPlaylistItem
} from '../../store/actions/youtube';

import List from '../../components/List';
import Placeholder from '../../components/Placeholder';
import VideoCard from '../../components/cards/VideoCard';

import MenuWrapper from '../../components/menu/MenuWrapper';

const ChannelVideos = () => {
    const { channelId } = useParams();
    const navigate = useNavigate();

    const { items, totalResults } = useSelector(
        ({ channel: { items, totalResults } }) => ({
            items,
            totalResults
        })
    );

    const dispatch = useDispatch();

    const handleGetChannelVideos = () => getChannelVideos(channelId);

    const handleClearChannelVideos = () => clearChannelVideos;

    const handleQueueItem = (video) => dispatch(queueItem(video));

    const handleEditPlaylistItem = ({ id }) => dispatch(editPlaylistItem(id));

    useEffect(() => handleClearChannelVideos, []);

    return totalResults === 0 ? (
        <Placeholder icon="list" text="This channel hasn't uploaded videos." />
    ) : (
        <MenuWrapper
            menuItems={[
                {
                    title: `Add to queue`,
                    icon: 'circle-add',
                    onClick: handleQueueItem
                },

                {
                    title: `Save to playlist`,
                    icon: 'folder-add',
                    onClick: handleEditPlaylistItem
                }
            ]}
        >
            {(openMenu) => (
                <List
                    items={items}
                    loadMoreItems={handleGetChannelVideos}
                    itemKey={(index, data) => data[index].id}
                    renderItem={({ data }) => (
                        <VideoCard
                            {...data}
                            onClick={() => navigate(`/video/${data.id}`)}
                            onClickMenu={() => openMenu(data)}
                        />
                    )}
                />
            )}
        </MenuWrapper>
    );
};

export default ChannelVideos;
