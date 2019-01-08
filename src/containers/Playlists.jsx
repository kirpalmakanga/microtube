import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    getPlaylists,
    queuePlaylist,
    removePlaylist
} from '../actions/youtube';

import Screen from '../layout/Screen';

import Grid from '../components/Grid';

import PlaylistCard from '../components/cards/PlaylistCard';

class Playlists extends Component {
    render() {
        const {
            items,
            nextPageToken,
            getPlaylists,
            makeQueuePlaylist,
            removePlaylist
        } = this.props;

        return (
            <Screen>
                <Grid
                    items={items}
                    loadContent={() =>
                        nextPageToken !== null &&
                        getPlaylists({
                            mine: true,
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
                                removePlaylist={() =>
                                    removePlaylist({ title, playlistId })
                                }
                            />
                        );
                    }}
                />
            </Screen>
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

    removePlaylist: (data) => dispatch(removePlaylist(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlists);
