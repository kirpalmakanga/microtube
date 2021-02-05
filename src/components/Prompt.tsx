import {
    useEffect,
    useCallback,
    useRef,
    FunctionComponent,
    SyntheticEvent
} from 'react';
import Fade from './animations/Fade';

import Icon from './Icon';

import Button from './Button';
import DropDown from './DropDown';

import List from './List';

import { useMergedState } from '../lib/hooks';
import { stopPropagation, preventDefault } from '../lib/helpers';
import { usePrompt } from '../store/hooks/prompt';
import { GenericObject } from '../..';

// class ImportVideoForm extends Component {
//     state = {
//         data: { text: '' }
//     };

//     handleChange = ({ target: { name, value } }) =>
//         this.setState(({ data }) => ({
//             data: { ...data, [name]: value }
//         }));

//     handleSubmit = preventDefault(() => {
//         const {
//             data: { text }
//         } = this.state;

//         this.props.onSubmit(text);
//     });

//     getInputRef = (el) => (this.input = el);

//     componentDidMount() {
//         this.input.focus();

//         this.__keyPressHandler = stopPropagation();
//         this.input.addEventListener('keypress', this.__keyPressHandler);
//     }

//     componentWillUnmount() {
//         this.input.removeEventListener('keypress', this.__keyPressHandler);
//     }

//     render() {
//         const {
//             state: {
//                 data: { text }
//             },
//             props: { id = '' },
//             getInputRef,
//             handleChange,
//             handleSubmit
//         } = this;

//         return (
//             <form id={id} onSubmit={handleSubmit}>
//                 <div className="textfield">
//                     <textarea
//                         id="videoId"
//                         ref={getInputRef}
//                         className="textfield__input"
//                         type="text"
//                         name="text"
//                         value={text}
//                         onChange={handleChange}
//                         autoFocus
//                         placeholder="URLs/IDs..."
//                         rows="10"
//                     />
//                 </div>
//             </form>
//         );
//     }
// }

const privacyOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
    { label: 'Unlisted', value: 'unlisted' }
];

interface FormProps {
    onSubmit: (data: GenericObject) => void;
}

const NewPlayListForm: FunctionComponent<FormProps> = ({ onSubmit }) => {
    const [state, setState] = useMergedState({
        title: '',
        privacyStatus: 'public'
    });

    const setValue = useCallback(
        (key, value) => setState({ [key]: value }),
        []
    );

    const handleInput = useCallback(
        ({
            currentTarget: { name, value }
        }: SyntheticEvent<HTMLInputElement>) => setValue(name, value),
        []
    );

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        onSubmit(state);
    }, []);

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

interface PlaylistData {
    playlistId: string;
    title: string;
    itemCount: number;
}

interface Props {
    items: PlaylistData[];
    loadContent: () => void;
    onClickItem: (data: PlaylistData) => void;
}

const PlaylistManager: FunctionComponent<Props> = ({
    items,
    loadContent,
    onClickItem
}) => {
    const onCreatePlaylist = useCallback((data) => onClickItem(data), []);
    const makeOnClickItem = useCallback((data) => () => onClickItem(data), []);

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
                    loadMoreItems={loadContent}
                    renderItem={renderOption}
                    itemSize={54}
                />
            </div>
        </div>
    );
};

const Prompt: FunctionComponent = ({ children }) => {
    const [
        { isVisible, headerText, confirmText, cancelText, callback },
        { closePrompt }
    ] = usePrompt();

    return (
        <Fade className="dialog__overlay" onClick={closePrompt} in={isVisible}>
            <div className="dialog shadow--2dp" onClick={stopPropagation()}>
                <header className="dialog__header">
                    <Icon name="prompt" />

                    <span>{headerText}</span>
                </header>

                {children}

                <footer className="dialog__actions">
                    {cancelText ? (
                        <Button
                            className="button button--close shadow--2dp"
                            onClick={closePrompt}
                            title={cancelText}
                        />
                    ) : null}

                    <Button
                        className="button shadow--2dp"
                        type="button"
                        onClick={callback}
                        title={confirmText}
                    />
                </footer>
            </div>
        </Fade>
    );
};

export default Prompt;
