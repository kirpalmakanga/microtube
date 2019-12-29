import { Component } from 'react';
import { connect } from 'react-redux';

import {
    getPlaylists,
    clearPlaylists,
    queuePlaylist,
    removePlaylist
} from '../actions/youtube';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import PlaylistCard from '../components/cards/PlaylistCard';

import MenuWrapper from '../components/menu/MenuWrapper';

class Playlists extends Component {
    componentWillUnmount() {
        this.props.clearPlaylists();
    }

    render() {
        const {
            props: {
                channelId,
                items,
                totalResults,
                getPlaylists,
                queuePlaylist,
                removePlaylist,
                history
            }
        } = this;

        return totalResults === 0 ? (
            <Placeholder
                icon="empty"
                text={
                    channelId
                        ? "This channel doesn't have playlists."
                        : "You haven't created playlists yet."
                }
            />
        ) : (
            <MenuWrapper
                menuItems={[
                    {
                        title: 'Queue playlist',
                        icon: 'queue',
                        onClick: ({ id }) => queuePlaylist(id)
                    },
                    {
                        title: 'Launch playlist',
                        icon: 'playlist-play',
                        onClick: ({ id }) => queuePlaylist(id, true)
                    },
                    ...(!channelId
                        ? [
                              {
                                  title: 'Remove playlist',
                                  icon: 'delete',
                                  onClick: ({ id, title }) =>
                                      removePlaylist(id, title)
                              }
                          ]
                        : [])
                ]}
            >
                {(openMenu) => (
                    <List
                        items={items}
                        itemKey={(index, data) => data[index].id}
                        renderItem={({ data }) => {
                            const { id, title } = data;

                            return (
                                <PlaylistCard
                                    {...data}
                                    onClick={() =>
                                        history.push(`/playlist/${id}`)
                                    }
                                    onClickMenu={() =>
                                        openMenu({ id, title }, title)
                                    }
                                />
                            );
                        }}
                        loadMoreItems={() =>
                            getPlaylists(
                                channelId ? { channelId } : { mine: true }
                            )
                        }
                    />
                )}
            </MenuWrapper>
        );
    }
}

const mapStateToProps = ({ playlists: { items, totalResults } }) => ({
    items,
    totalResults
});

const mapDispatchToProps = {
    getPlaylists,
    queuePlaylist,
    removePlaylist,
    clearPlaylists
};

export default connect(mapStateToProps, mapDispatchToProps)(Playlists);
