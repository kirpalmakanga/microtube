import { Component } from 'react';
import { connect } from 'react-redux';

import {
    getPlaylistTitle,
    getPlaylistItems,
    clearPlaylistItems,
    queueItem,
    playItem,
    removePlaylistItem,
    editPlaylistItem
} from '../actions/youtube';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import VideoCard from '../components/cards/VideoCard';
import MenuWrapper from '../components/menu/MenuWrapper';

class Playlist extends Component {
    componentDidMount() {
        this.props.getPlaylistTitle(this.props.playlistId);
    }

    componentWillUnmount() {
        this.props.clearPlaylistItems();
    }

    componentDidUpdate({ playlistId: previousPlaylistId }) {
        const { playlistId, clearItems } = this.props;

        if (playlistId !== previousPlaylistId) {
            clearItems();
        }
    }

    render() {
        const {
            props: {
                playlistId,
                items,
                totalResults,
                getPlaylistItems,
                playItem,
                queueItem,
                removePlaylistItem,
                editPlaylistItem
            }
        } = this;

        return totalResults === 0 ? (
            <Placeholder icon="empty" text="This playlist is empty." />
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
                    },

                    {
                        title: `Remove from playlist`,
                        icon: 'delete',
                        onClick: ({ playlistItemId, playlistId, title }) =>
                            removePlaylistItem(
                                playlistItemId,
                                playlistId,
                                title
                            )
                    }
                ]}
            >
                {(openMenu) => (
                    <List
                        items={items}
                        itemKey={(index, data) => data[index].id}
                        renderItem={({ data }) => (
                            <VideoCard
                                {...data}
                                onClick={() => playItem(data)}
                                onClickMenu={() => openMenu(data, data.title)}
                            />
                        )}
                        loadMoreItems={() => getPlaylistItems(playlistId)}
                    />
                )}
            </MenuWrapper>
        );
    }
}

const mapStateToProps = (
    { playlistItems: { playlistTitle, items, nextPageToken, totalResults } },
    {
        match: {
            params: { playlistId }
        }
    }
) => ({
    playlistId,
    playlistTitle,
    items,
    nextPageToken,
    totalResults
});

const mapDispatchToProps = {
    getPlaylistTitle,
    getPlaylistItems,
    clearPlaylistItems,
    editPlaylistItem,
    removePlaylistItem,
    queueItem,
    playItem
};

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
