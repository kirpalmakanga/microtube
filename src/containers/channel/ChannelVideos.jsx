import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getChannelVideos,
    clearChannelVideos,
    queueItem,
    playItem,
    editPlaylistItem
} from '../../actions/youtube';

import List from '../../components/List';
import Placeholder from '../../components/Placeholder';
import VideoCard from '../../components/cards/VideoCard';

import MenuWrapper from '../../components/menu/MenuWrapper';

const ChannelVideos = ({
    items,
    totalResults,
    getChannelVideos,
    queueItem,
    editPlaylistItem,
    clearChannelVideos
}) => {
    const { channelId } = useParams();
    const navigate = useNavigate();

    useEffect(() => clearChannelVideos, []);

    return totalResults === 0 ? (
        <Placeholder icon="empty" text="This channel hasn't uploaded videos." />
    ) : (
        <MenuWrapper
            menuItems={[
                {
                    title: `Add to queue`,
                    icon: 'queue',
                    onClick: queueItem
                },

                {
                    title: `Add to playlist`,
                    icon: 'playlist-add',
                    onClick: ({ id }) => editPlaylistItem(id)
                }
            ]}
        >
            {(openMenu) => (
                <List
                    items={items}
                    loadMoreItems={() => getChannelVideos({ channelId })}
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

const mapStateToProps = ({ channel: { items, totalResults } }) => ({
    items,
    totalResults
});

const mapDispatchToProps = {
    getChannelVideos,
    clearChannelVideos,
    editPlaylistItem,
    queueItem,
    playItem
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelVideos);
