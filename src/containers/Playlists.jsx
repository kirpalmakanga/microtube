import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getPlaylists,
    queuePlaylist,
    removePlaylist
} from '../actions/youtube';

import Grid from '../components/Grid';

import PlaylistCard from '../components/cards/PlaylistCard';

class Playlists extends Component {
    componentWillUnmount() {
        this.props.clearItems();
    }

    render() {
        const {
            channelId,
            items,
            nextPageToken,
            getPlaylists,
            makeQueuePlaylist,
            removePlaylist
        } = this.props;

        return (
            <Grid
                items={items}
                loadContent={() =>
                    nextPageToken !== null &&
                    getPlaylists({
                        ...(channelId ? { channelId } : { mine: true }),
                        pageToken: nextPageToken
                    })
                }
                renderItem={(data) => {
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
            />
        );
    }
}

const mapStateToProps = ({ playlists: { items, nextPageToken } }) => ({
    items,
    nextPageToken
});

const mapDispatchToProps = (dispatch) => ({
    getPlaylists: (data) => dispatch(getPlaylists(data)),

    makeQueuePlaylist: (data) => () => dispatch(queuePlaylist(data)),

    removePlaylist: (data) => dispatch(removePlaylist(data)),

    clearItems: () => dispatch({ type: 'playlists/CLEAR_ITEMS' })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlists);
