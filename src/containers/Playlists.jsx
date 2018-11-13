import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getPlaylists, queuePlaylist } from '../actions/youtube';

import Screen from '../layout/Screen';

import Grid from '../components/Grid';

import PlaylistCard from '../components/cards/PlaylistCard';

/* TODO: Créer un composant "Screen" */

class Playlists extends Component {
    /* TODO: Test si ça marche sans */
    // componentDidMount() {
    //     this.forceUpdate();
    // }

    render() {
        const {
            items,
            nextPageToken,
            getPlaylists,
            queuePlaylist,
            openPlaylist
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
                    ItemComponent={PlaylistCard}
                    renderItem={(data) => {
                        const { id: playlistId, title } = data;

                        return (
                            <PlaylistCard
                                {...data}
                                onClick={openPlaylist(title)}
                                queuePlaylist={queuePlaylist({
                                    playlistId
                                })}
                                launchPlaylist={queuePlaylist({
                                    playlistId,
                                    play: true
                                })}
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
    queuePlaylist: (data) => () => dispatch(queuePlaylist(data)),
    openPlaylist: (data) => () => dispatch({ type: 'PLAYLIST_OPEN', data })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlists);
