import {
    useEffect,
    useRef,
    FunctionComponent,
    SyntheticEvent,
    FormEvent
} from 'react';

import { useMergedState } from '../../lib/hooks';

import DropDown from '../DropDown';
import Button from '../Button';
import List from '../List';
import { usePlaylists } from '../../store/hooks/playlists';

interface PlaylistData {
    playlistId: string;
    title: string;
    itemCount: number;
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

const NewPlayListForm: FunctionComponent<FormProps> = ({ onSubmit }) => {
    const [state, setState] = useMergedState({
        title: '',
        privacyStatus: 'public'
    });

    const setValue = (key: string, value: unknown) =>
        setState({ [key]: value });

    const handleInput = ({
        currentTarget: { name, value }
    }: SyntheticEvent<HTMLInputElement>) => setValue(name, value);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(state as PlaylistData);
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const __keyDownHandler = (e: any) => {
            e.stopPropagation();
        };

        inputRef.current?.addEventListener('keydown', __keyDownHandler);

        return () => {
            inputRef.current?.removeEventListener('keydown', __keyDownHandler);
        };
    }, []);

    const { title, privacyStatus } = state;

    return (
        <form className="playlist-menu__form" onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                className="playlist-menu__item-text"
                name="title"
                value={title}
                placeholder="Playlist title"
                onChange={handleInput}
            />

            <DropDown
                currentValue={privacyStatus}
                options={privacyOptions}
                onSelect={(value) => setValue('privacyStatus', value)}
            />

            <Button type="submit" title="Create" />
        </form>
    );
};

export const PlaylistManager: FunctionComponent<Props> = ({ onClickItem }) => {
    const [{ items }, { getPlaylists }] = usePlaylists();
    const onCreatePlaylist = (data: PlaylistData) => onClickItem(data);
    const makeOnClickItem = (data: PlaylistData) => () => onClickItem(data);

    const renderOption = (data: PlaylistData) => {
        const { playlistId, title, itemCount } = data;

        return (
            <button
                className="playlist-menu__item"
                key={playlistId}
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
                    itemSize={54}
                />
            </div>
        </div>
    );
};

export default PlaylistManager;
