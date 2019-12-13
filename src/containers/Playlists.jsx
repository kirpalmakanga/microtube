import React, { Component } from 'react';
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

        return (
            <MenuWrapper
                menuItems={[
                    {
                        title: 'Queue playlist',
                        icon: 'queue',
                        onClick: ({ playlistId }) => queuePlaylist(playlistId)
                    },
                    {
                        title: 'Launch playlist',
                        icon: 'playlist-play',
                        onClick: ({ playlistId }) =>
                            queuePlaylist(playlistId, true)
                    },
                    ...(!channelId
                        ? [
                              {
                                  title: 'Remove playlist',
                                  icon: 'delete',
                                  onClick: ({ playlistId, playlistTitle }) =>
                                      removePlaylist(playlistId, playlistTitle)
                              }
                          ]
                        : [])
                ]}
            >
                {(openMenu) =>
                    totalResults === 0 ? (
                        <Placeholder
                            icon="empty"
                            text={
                                channelId
                                    ? "This channel doesn't have playlists."
                                    : "You haven't created playlists yet."
                            }
                        />
                    ) : (
                        <List
                            items={items}
                            itemKey={(index, data) => data[index].id}
                            renderItem={({ data }) => {
                                const {
                                    id: playlistId,
                                    title: playlistTitle
                                } = data;

                                return (
                                    <PlaylistCard
                                        {...data}
                                        onClick={() =>
                                            history.push(
                                                `/playlist/${playlistId}`
                                            )
                                        }
                                        onClickMenu={() =>
                                            openMenu({
                                                playlistId,
                                                playlistTitle
                                            })
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
                    )
                }
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
