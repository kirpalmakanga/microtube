import { Component } from 'solid-js';
import { createStore } from 'solid-js/store';

import DropDown from '../DropDown';
import Button from '../Button';
import List from '../List';
import { usePlaylists } from '../../store/hooks/playlists';
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
    const [state, setState] = createStore<PlaylistData>({
        title: '',
        privacyStatus: 'public'
    });

    const setValue = (key: string, value: unknown) =>
        setState({ [key]: value });

    const handlePrivacyStatusChange = (value: string) =>
        setValue('privacyStatus', value);

    const handleInput = ({ currentTarget: { name, value } }) =>
        setValue(name, value);

    const handleSubmit = preventDefault(() => onSubmit(state as PlaylistData));

    const { title, privacyStatus } = state;

    return (
        <form className="playlist-menu__form" onSubmit={handleSubmit}>
            <input
                className="playlist-menu__item-text"
                name="title"
                value={title}
                placeholder="Playlist title"
                onChange={handleInput}
                onKeyDown={stopPropagation()}
            />

            <DropDown
                currentValue={privacyStatus}
                options={privacyOptions}
                onSelect={handlePrivacyStatusChange}
            />

            <Button type="submit" title="Create" />
        </form>
    );
};

export const PlaylistManager: Component<Props> = ({ onClickItem }) => {
    const [{ items }, { getPlaylists }] = usePlaylists();
    const onCreatePlaylist = (data: PlaylistData) => onClickItem(data);
    const makeOnClickItem = (data: PlaylistData) => () => onClickItem(data);

    const renderOption = (data: PlaylistData) => {
        const { playlistId, title, itemCount } = data;

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
                    items={items}
                    itemKey={({ id }) => id}
                    loadMoreItems={getPlaylists}
                    renderItem={renderOption}
                />
            </div>
        </div>
    );
};

export default PlaylistManager;
