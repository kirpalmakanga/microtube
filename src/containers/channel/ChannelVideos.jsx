import { Component } from 'react';
import { connect } from 'react-redux';

import {
    getChannelVideos,
    clearChannelVideos,
    queueItem,
    playItem,
    editPlaylistItem,
    removePlaylistItem
} from '../../actions/youtube';

import List from '../../components/List';
import Placeholder from '../../components/Placeholder';
import VideoCard from '../../components/cards/VideoCard';

import MenuWrapper from '../../components/menu/MenuWrapper';

class ChannelVideos extends Component {
    componentWillUnmount() {
        this.props.clearChannelVideos();
    }

    render() {
        const {
            props: {
                channelId,
                items,
                totalResults,
                getChannelVideos,
                queueItem,
                playItem,
                editPlaylistItem,
                history
            }
        } = this;

        return totalResults === 0 ? (
            <Placeholder
                icon="empty"
                text="This channel hasn't uploaded videos."
            />
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
                                onClick={() =>
                                    history.push(`/video/${data.id}`)
                                }
                                onClickMenu={() => openMenu(data)}
                            />
                        )}
                    />
                )}
            </MenuWrapper>
        );
    }
}

const mapStateToProps = (
    { channel: { items, totalResults } },
    {
        match: {
            params: { channelId }
        }
    }
) => ({
    channelId,
    items,
    totalResults
});

const mapDispatchToProps = {
    getChannelVideos,
    clearChannelVideos,
    editPlaylistItem,
    removePlaylistItem,
    queueItem,
    playItem
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelVideos);
