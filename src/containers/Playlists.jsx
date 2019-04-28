import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getPlaylists,
    queuePlaylist,
    removePlaylist
} from '../actions/youtube';

import List from '../components/List';
import Placeholder from '../components/Placeholder';

import PlaylistCard from '../components/cards/PlaylistCard';

class Playlists extends Component {
    componentWillUnmount() {
        this.props.clearItems();
    }

    render() {
        const {
            props: {
                channelId,
                items,
                totalResults,
                makeQueuePlaylist,
                removePlaylist,
                loadContent
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
                            queuePlaylist={makeQueuePlaylist({
                                playlistId
                            })}
                            launchPlaylist={makeQueuePlaylist({
                                playlistId,
                                play: true
                            })}
                            {...(channelId
                                ? {}
                                : {
                                      removePlaylist: () =>
                                          removePlaylist({ title, playlistId })
                                  })}
                        />
                    );
                }}
                loadMoreItems={loadContent}
            />
        );
    }
}

const mapStateToProps = ({ playlists: { items, totalResults } }) => ({
    items,
    totalResults
});

const mapDispatchToProps = (dispatch, { channelId }) => ({
    loadContent: () =>
        dispatch(
            getPlaylists({
                ...(channelId ? { channelId } : { mine: true })
            })
        ),

    makeQueuePlaylist: (data) => () => dispatch(queuePlaylist(data)),

    removePlaylist: (data) => dispatch(removePlaylist(data)),

    clearItems: () => dispatch({ type: 'playlists/CLEAR_ITEMS' })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlists);
