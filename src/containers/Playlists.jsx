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

import Menu from '../components/menu/Menu';
import MenuItem from '../components/menu/MenuItem';

class Playlists extends Component {
    state = { isMenuOpen: false, playlistId: '' };

    componentWillUnmount() {
        this.props.clearPlaylists();
    }

    openMenu = (playlistId, playlistTitle) => () =>
        this.setState({ isMenuOpen: true, playlistId, playlistTitle });

    closeMenu = () => this.setState({ isMenuOpen: false, playlistId: '' });

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
            },
            state: { isMenuOpen, playlistId, playlistTitle },
            openMenu,
            closeMenu
        } = this;

        return (
            <>
                {totalResults === 0 ? (
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
                                    onClick={() =>
                                        history.push(`/playlist/${playlistId}`)
                                    }
                                    onClickMenu={openMenu(playlistId, title)}
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

                <Menu isVisible={isMenuOpen} onClick={closeMenu}>
                    <MenuItem
                        title="Queue playlist"
                        icon="queue"
                        onClick={() => queuePlaylist(playlistId)}
                    />

                    <MenuItem
                        title="Launch playlist"
                        icon="playlist-play"
                        onClick={() => queuePlaylist(playlistId, true)}
                    />

                    {!channelId ? (
                        <MenuItem
                            title="Remove playlist"
                            icon="delete"
                            onClick={() =>
                                removePlaylist(playlistId, playlistTitle)
                            }
                        />
                    ) : null}
                </Menu>
            </>
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
