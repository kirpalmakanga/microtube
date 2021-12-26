import { Component } from 'solid-js';
import { createStore } from 'solid-js/store';

import DropDown from '../DropDown';
import Button from '../Button';
import List from '../List';
import { usePlaylists } from '../../store/playlists';
import { preventDefault, stopPropagation } from '../../lib/helpers';

interface PlaylistData {
    playlistId: string;
    title: string;
    itemCount: number;
    privacyStatus: string;
}

interface Props {
    onClickItem: (data: PlaylistData) => void;
}

interface FormProps {
    onSubmit: (data: PlaylistData) => void;
}

const privacyOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
    { label: 'Unlisted', value: 'unlisted' }
];

const NewPlayListForm: Component<FormProps> = ({ onSubmit }) => {
    const [state, setState] = createStore({
        title: '',
        privacyStatus: 'public'
    });

    const setValue = (key: string, value: unknown) =>
        setState({ [key]: value });

    const handlePrivacyStatusChange = (value: unknown) =>
        setValue('privacyStatus', value as string);

    const handleInput = ({
        currentTarget: { name, value }
    }: {
        currentTarget: HTMLInputElement;
    }) => setValue(name, value);

    const handleSubmit = preventDefault(() => onSubmit(state as PlaylistData));

    return (
        <form className="playlist-menu__form" onSubmit={handleSubmit}>
            <input
                className="playlist-menu__item-text"
                name="title"
                value={state.title}
                placeholder="Playlist title"
                onChange={handleInput}
                onKeyPress={stopPropagation()}
            />

            <DropDown
                currentValue={state.privacyStatus}
                options={privacyOptions}
                onSelect={handlePrivacyStatusChange}
            />

            <Button type="submit" title="Create" />
        </form>
    );
};

export const PlaylistManager: Component<Props> = ({ onClickItem }) => {
    const [playlists, { getPlaylists }] = usePlaylists();
    const onCreatePlaylist = (data: PlaylistData) => onClickItem(data);
    const makeOnClickItem = (data: PlaylistData) => () => onClickItem(data);

    const ListItem = ({ data }: { data: PlaylistData }) => {
        const { title, itemCount } = data;

        return (
            <button
                className="playlist-menu__item"
                onClick={makeOnClickItem(data)}
            >
                <span className="playlist-menu__item-text">{title}</span>

                <span className="playlist-menu__item-count">{itemCount}</span>
            </button>
        );
    };

    return (
        <div className="playlist-menu">
            <NewPlayListForm onSubmit={onCreatePlaylist} />

            <div className="playlist-menu__items">
                <List
                    items={playlists.items}
                    loadItems={getPlaylists}
                    itemSize={50}
                >
                    {ListItem}
                </List>
            </div>
        </div>
    );
};

export default PlaylistManager;
