import { Component, onCleanup, onMount, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import List from '../components/List';
import Placeholder from '../components/Placeholder';
import PlaylistItem from '../components/playlist/PlaylistItem';
import { usePlaylistItems } from '../store/playlist-items';

const Playlists: Component = () => {
    const params = useParams();

    const [playlistItems, { getPlaylistTitle, getPlaylistItems, clearPlaylistItems }] =
        usePlaylistItems(params.playlistId);

    onMount(() => {
        if (params.playlistId) {
            getPlaylistTitle(params.playlistId);
        }
    });

    onCleanup(clearPlaylistItems);

    return (
        <Show
            when={playlistItems.totalResults === null || playlistItems.totalResults > 0}
            fallback={<Placeholder icon="list" text="This playlist is empty." />}
        >
            <List items={playlistItems.items} loadItems={getPlaylistItems}>
                {PlaylistItem}
            </List>
        </Show>
    );
};

export default Playlists;
