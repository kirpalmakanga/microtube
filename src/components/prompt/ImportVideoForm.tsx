import { Component, createSignal, JSX } from 'solid-js';
import { preventDefault, stopPropagation } from '../../lib/helpers';

interface Props {
    onSubmit: (text: string) => void;
}

export const ImportVideoForm: Component<Props> = ({ onSubmit }) => {
    const [text, setState] = createSignal('');

    const handleChange: JSX.EventHandler<HTMLTextAreaElement, Event> = ({
        currentTarget: { value }
    }) => setState(value);

    const handleSubmit = preventDefault(() => onSubmit(text()));

    const handleKeyPress = stopPropagation();

    return (
        <form id="importVideos" onSubmit={handleSubmit}>
            <div className="textfield">
                <textarea
                    id="videoId"
                    className="textfield__textarea"
                    value={text()}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    autofocus
                    placeholder="URLs/IDs..."
                    rows={10}
                />
            </div>
        </form>
    );
};
