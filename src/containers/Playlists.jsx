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
                removePlaylist
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
            <List
                items={items}
                itemKey={(index, data) => data[index].id}
                renderItem={({ data }) => {
                    const { id: playlistId, title } = data;

                    return (
                        <PlaylistCard
                            {...data}
                            queuePlaylist={() =>
                                queuePlaylist({
                                    playlistId
                                })
                            }
                            launchPlaylist={() =>
                                queuePlaylist({
                                    playlistId,
                                    play: true
                                })
                            }
                            {...(channelId
                                ? {}
                                : {
                                      removePlaylist: () =>
                                          removePlaylist({ title, playlistId })
                                  })}
                        />
                    );
                }}
                loadMoreItems={() =>
                    getPlaylists(channelId ? { channelId } : { mine: true })
                }
            />
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlists);
