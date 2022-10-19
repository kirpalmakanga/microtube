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

    const handleSubmit = preventDefault(
        () => state.title && onSubmit(state as PlaylistData)
    );

    return (
        <form class="flex z-1 shadow" onSubmit={handleSubmit}>
            <input
                class="flex-grow bg-primary-800 focus:outline-none px-4 py-2 border-r-1 border-primary-700"
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

            <Button
                class="border-l-1 border-primary-700 bg-primary-900 hover:bg-primary-800 transition-colors px-4 py-2"
                type="submit"
                title="Create"
            />
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
                class="flex items-center bg-primary-700 hover:bg-primary-600 transition-colors w-full text-left overflow-hidden"
                onClick={makeOnClickItem(data)}
            >
                <span class="flex-grow text-light-50 font-montserrat overflow-ellipsis overflow-hidden p-4">
                    {title}
                </span>

                <span class="p-4">{itemCount}</span>
            </button>
        );
    };

    return (
        <div class="flex flex-col h-40vh">
            <NewPlayListForm onSubmit={onCreatePlaylist} />

            <List
                items={playlists.items}
                loadItems={getPlaylists}
                itemSize={50}
            >
                {ListItem}
            </List>
        </div>
    );
};

export default PlaylistManager;
