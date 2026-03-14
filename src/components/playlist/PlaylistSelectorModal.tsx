import { Component, JSX } from 'solid-js';
import { createStore } from 'solid-js/store';

import DropDown, { DropDownOption } from '../ui/DropDown';
import Button from '../ui/Button';
import List from '../List';
import { usePlaylists } from '../../store/playlists';
import { getThumbnails, preventDefault, stopPropagation } from '../../lib/helpers';
import Modal from '../ui/Modal';
import Img from '../ui/Img';

interface FormProps {
    onSubmit: (data: PlaylistData) => void;
}

const privacyOptions: DropDownOption<string>[] = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
    { label: 'Unlisted', value: 'unlisted' }
];

const NewPlayListForm: Component<FormProps> = ({ onSubmit }) => {
    const [state, setState] = createStore({
        title: '',
        privacyStatus: 'public'
    });

    const setValue = (key: string, value: unknown) => setState({ [key]: value });

    const handlePrivacyStatusChange = (value: string) => {
        setValue('privacyStatus', value);
    };

    const handleInput: JSX.EventHandler<HTMLInputElement, Event> = ({
        currentTarget: { name, value }
    }) => {
        setValue(name, value);
    };

    const handleSubmit = preventDefault(() => state.title && onSubmit(state as PlaylistData));

    return (
        <form class="flex flex-col z-1 gap-4" onSubmit={handleSubmit}>
            <fieldset class="flex flex-col gap-4">
                <label>New playlist</label>

                <div class="flex flex-col">
                    <label class="text-sm mb-1" for="playlist-title">
                        Title
                    </label>

                    <input
                        id="playlist-title"
                        class="h-8 flex-grow transition-colors bg-primary-800 hover:bg-primary-700 focus:(outline-none bg-primary-600) px-2 rounded"
                        name="title"
                        value={state.title}
                        placeholder="Title"
                        onChange={handleInput}
                        onKeyPress={stopPropagation()}
                    />
                </div>

                <div class="flex flex-col">
                    <label class="text-sm mb-1">Privacy</label>

                    <DropDown
                        currentValue={state.privacyStatus}
                        options={privacyOptions}
                        onSelect={handlePrivacyStatusChange}
                    />
                </div>
            </fieldset>

            <div class="flex justify-end">
                <Button
                    class="flex items-center justify-center gap-2 px-4 py-1 bg-violet-500 hover:bg-violet-400 transition-colors text-light-50 font-montserrat rounded shadow"
                    type="submit"
                    title="Create"
                    disabled={!state.title}
                />
            </div>
        </form>
    );
};

interface PlaylistSelectorModalProps {
    isVisible: boolean;
    onClickItem: (data: PlaylistData) => void;
    onClickClose: () => void;
}

export const PlaylistSelectorModal: Component<PlaylistSelectorModalProps> = (props) => {
    const [playlists, { getPlaylists }] = usePlaylists();
    const onCreatePlaylist = (data: PlaylistData) => {
        props.onClickItem(data);

        props.onClickClose();
    };
    const makeOnClickItem = (data: PlaylistData) => () => {
        props.onClickItem(data);

        props.onClickClose();
    };

    const ListItem = ({ data }: { data: PlaylistData }) => {
        return (
            <button
                class="flex items-center bg-primary-700 hover:bg-primary-600 transition-colors w-full text-left overflow-hidden p-4 gap-4"
                onClick={makeOnClickItem(data)}
            >
                <Img
                    class="w-24 rounded"
                    imgClass="w-full h-full object-cover"
                    src={
                        getThumbnails(data.thumbnails, 'medium') ||
                        getThumbnails(data.thumbnails, 'default')
                    }
                    alt={data.title}
                    background
                />

                <span class="flex-grow text-light-50 font-montserrat overflow-ellipsis overflow-hidden">
                    {data.title}
                </span>

                <span class="text-sm">{`${data.itemCount} item${data.itemCount !== 1 ? 's' : ''}`}</span>
            </button>
        );
    };

    return (
        <Modal title="Save" isVisible={props.isVisible} onClickClose={props.onClickClose}>
            <div class="flex flex-col h-60vh gap-4">
                <List items={playlists.items} loadItems={getPlaylists} itemSize={76}>
                    {ListItem}
                </List>

                <div class="bg-white opacity-10 h-[1px]"></div>

                <NewPlayListForm onSubmit={onCreatePlaylist} />
            </div>
        </Modal>
    );
};

export default PlaylistSelectorModal;
